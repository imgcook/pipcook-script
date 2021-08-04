import { ModelEntry, PredictResult, PredictEntry } from '@pipcook/core';
import * as path from 'path';
import * as fs from 'fs-extra';
import { TransedSample, TransedMetadata } from './types';
import * as tf from '@tensorflow/tfjs-node';

const defaultWeightsMap: {[key: string]: string} = {
  'resnet': 'https://ai-sample.oss-cn-hangzhou.aliyuncs.com/pipcook/models/resnet50_tfjs/model.json',
  'mobilenet': 'http://ai-sample.oss-cn-hangzhou.aliyuncs.com/pipcook/models/mobilenet/web_model/model.json'
}

/**
 * this is the plugin used to load a mobilenet model or load existing model.
 * @param optimizer (string | tf.train.Optimizer)[optional / default = tf.train.adam()] the optimizer of model
 * @param loss (string | string [] | {[outputName: string]: string} | LossOrMetricFn | LossOrMetricFn [] | {[outputName: string]: LossOrMetricFn}) \
 * [optional / default = 'categoricalCrossentropy'] the loss function of model
 * @param metrics (string | LossOrMetricFn | Array | {[outputName: string]: string | LossOrMetricFn}): [optional / default = ['accuracy']]
 * @param hiddenLayerUnits (number): [optional / default = 10]
*/
async function constructModel(options: Record<string, any>, meta: TransedMetadata) {
  let {
    // @ts-ignore
    optimizer = tf.train.adam(),
    loss = 'categoricalCrossentropy',
    metrics = [ 'accuracy' ],
    hiddenLayerUnits = 10,
    modelUrl = 'mobilenet',
    freeze = true
  } = options;
  modelUrl = defaultWeightsMap[modelUrl] || modelUrl;
  const categories = meta.categories;
  const inputShape = meta.dimension;
  if (!Array.isArray(categories)) {
    throw new TypeError('categorie is not found');
  }
  const NUM_CLASSES = categories?.length;
  let model: tf.LayersModel | null = null;
  const localModel = tf.sequential();
  localModel.add(
    tf.layers.inputLayer({
      inputShape: [inputShape.x, inputShape.y, inputShape.z]
    })
  );
  console.log('loading model ...');
  const mobilenet = await tf.loadLayersModel(modelUrl);
  if (freeze) {
    for (const _layer of mobilenet.layers) {
      _layer.trainable = false;
    }
  }
  localModel.add(mobilenet);
  localModel.add(tf.layers.flatten());
  localModel.add(tf.layers.dense({
    units: hiddenLayerUnits,
    activation: 'relu'
  }));
  localModel.add(tf.layers.dense({
    units: NUM_CLASSES,
    activation: 'softmax'
  }));
  model = localModel as tf.LayersModel;

  model.compile({
    optimizer,
    loss,
    metrics
  });

  return model;
}


/**
 * this is plugin used to train tfjs model with pascal voc data format for image classification problem.
 * @param data : train data
 * @param model : model loaded before
 * @param epochs : need to specify epochs
 * @param batchSize : need to specify batch size
 * @param optimizer : need to specify optimizer
 */
// @ts-ignore
 async function trainModel(options: Record<string, any>, modelDir: string, model: tf.LayersModel, dataset: DataSourceApi<Image>) {
  const {
    epochs = 10,
    batchSize = 16
  } = options;
  await dataset.shuffle();
  const { size } = await dataset.getDatasetMeta();
  const { train: trainSize } = size;
  const batchesPerEpoch = Math.floor(trainSize / batchSize);
  const meta = await dataset.getDatasetMeta();
  for (let i = 0; i < epochs; i++) {
    console.log(`Epoch ${i}/${epochs} start`);
    await dataset.train.seek(0);
    for (let j = 0; j < batchesPerEpoch; j++) {
      const dataBatch = await dataset.train.nextBatch(batchSize);
      // @ts-ignore
      const xs = tf.tidy(() => tf.stack(dataBatch.map((ele) => ele.data)));
      // @ts-ignore
      const ys = tf.tidy(() => tf.stack(dataBatch.map((ele) => tf.oneHot(meta.categories?.indexOf(ele.label), meta.categories.length))));
      const trainRes = await model.trainOnBatch(xs, ys) as number[];
      tf.dispose(xs);
      tf.dispose(ys);
      dataBatch.forEach((ele: any) => {
        tf.dispose(ele.data);
      })
      if (j % Math.floor(batchesPerEpoch / 10) === 0) {
        console.log(`Iteration ${j}/${batchesPerEpoch} result --- loss: ${trainRes[0]} accuracy: ${trainRes[1]}`);
      }
    }
  }
  await model.save(`file://${modelDir}`);
  await fs.writeJSON(path.join(modelDir, 'categories.json'), meta.categories);
}

const train: ModelEntry<TransedSample, TransedMetadata> = async (api, options, context) => {
  const { modelDir } = context.workspace;
  const meta = await api.dataset.getDatasetMeta();
  if (!meta) {
    throw new TypeError('meta is not found');
  }
  const model = await constructModel(options, meta);
  // @ts-ignore
  await trainModel(options, modelDir, model, api.dataset, tf);
}

let predictModel: tf.LayersModel;
let categories: string[];

const predict: PredictEntry<TransedSample, TransedMetadata> = async (api, _, context): Promise<PredictResult> => {
  const { modelDir } = context.workspace;

  if (!categories) {
    categories = await fs.readJSON(path.join(modelDir, 'categories.json'));
  }
  if (!predictModel) {
    predictModel = await tf.loadLayersModel(`file://${path.join(modelDir, 'model.json')}`);
  }

  await api.dataset.predicted?.seek(0);
  const dataBatch = await api.dataset.predicted?.nextBatch(-1);

  if (!dataBatch) {
    throw new TypeError('wrong data');
  }

  const tensors = tf.stack(dataBatch.map(ele => ele.data));
  const result = predictModel.predict(tensors) as tf.Tensor;
  const argMax = tf.argMax(result, 1);
  const ids = Array.from(argMax.dataSync());
  return ids.map((id: number) => {
    return {
      id,
      category: categories[id],
      score: result.dataSync()[id]
    }
  })
}

export {
  train,
  predict
}
