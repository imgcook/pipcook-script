import { ModelEntry, Runtime, ScriptContext } from '@pipcook/core';
import type { Dataset } from '@pipcook/datacook';

function argMax(array: any) {
  return [].map.call(array, (x: any, i: any) => [ x, i ]).reduce((r: any, a: any) => (a[0] > r[0] ? a : r))[1];
}

/**
 * this is the plugin used to load a mobilenet model or load existing model.
 * @param optimizer (string | tf.train.Optimizer)[optional / default = tf.train.adam()] the optimizer of model
 * @param loss (string | string [] | {[outputName: string]: string} | LossOrMetricFn | LossOrMetricFn [] | {[outputName: string]: LossOrMetricFn}) \
 * [optional / default = 'categoricalCrossentropy'] the loss function of model
 * @param metrics (string | LossOrMetricFn | Array | {[outputName: string]: string | LossOrMetricFn}): [optional / default = ['accuracy']]
 * @param hiddenLayerUnits (number): [optional / default = 10]
*/
async function constructModel(options: Record<string, any>, labelMap: any, tf: any){
  let {
    // @ts-ignore
    optimizer = tf.train.adam(),
    loss = 'categoricalCrossentropy',
    metrics = [ 'accuracy' ],
    hiddenLayerUnits = 10,
    modelUrl = 'http://ai-sample.oss-cn-hangzhou.aliyuncs.com/pipcook/models/mobilenet/web_model/model.json'
  } = options;
  const NUM_CLASSES = labelMap.length;
  // @ts-ignore
  let model: tf.LayersModel | null = null;
  // @ts-ignore
  const localModel = tf.sequential();
  // @ts-ignore
  const mobilenet = await tf.loadLayersModel(modelUrl);
  const layer = mobilenet.getLayer('conv_pw_13_relu');
  // @ts-ignore
  const truncatedMobilenet = tf.model({
    inputs: mobilenet.inputs,
    outputs: layer.output
  });
  for (const _layer of truncatedMobilenet.layers) {
    _layer.trainable = false;
  }
  localModel.add(truncatedMobilenet);
  // @ts-ignore
  localModel.add(tf.layers.flatten({
    // @ts-ignore
    inputShape: layer.outputShape.slice(1) as tf.Shape
  }));
  // @ts-ignore
  localModel.add(tf.layers.dense({
    units: hiddenLayerUnits,
    activation: 'relu'
  }));
  // @ts-ignore
  localModel.add(tf.layers.dense({
    units: NUM_CLASSES,
    activation: 'softmax'
  }));
  // @ts-ignore
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
 async function trainModel(options: Record<string, any>, modelDir: string, model: tf.LayersModel, dataset: DataSourceApi<Image>, tf: any) {
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
      const ys = tf.tidy(() => tf.stack(dataBatch.map((ele) => tf.oneHot(ele.label, meta.labelMap.length))));
      const trainRes = await model.trainOnBatch(xs, ys) as number[];
      if (j % Math.floor(batchesPerEpoch / 10) === 0) {
        console.log(`Iteration ${j}/${batchesPerEpoch} result --- loss: ${trainRes[0]} accuracy: ${trainRes[1]}`);
      }
    }
  }
  await model.save(`file://${modelDir}`);
}

const main: ModelEntry<Dataset.Types.Sample, Dataset.Types.ImageDatasetMeta> = async (api: Runtime<Dataset.Types.Sample, Dataset.Types.ImageDatasetMeta>, options: Record<string, any>, context: ScriptContext) => {
  const { modelDir } = context.workspace;
  let tf;
  try {
    tf = await context.importJS('@tensorflow/tfjs-node-gpu');
  } catch {
    tf = await context.importJS('@tensorflow/tfjs-node');
  }
  // @ts-ignore
  const meta: Dataset.Types.ImageDatasetMeta = await api.dataset.getDatasetMeta() as Dataset.Types.ImageDatasetMeta;
  // @ts-ignore
  const labelMap = meta.labelMap;
  // TODO add assert

  const model = await constructModel(options, labelMap, tf);
  // @ts-ignore
  await trainModel(options, modelDir, model, api.dataset, tf);
}

export default main;
