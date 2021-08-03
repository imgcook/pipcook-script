import { DataCook, DatasetPool, ModelEntry, Runtime, ScriptContext, PredictResult } from '@pipcook/core';
import * as tf from '@tensorflow/tfjs-node';
import * as path from 'path';
import * as fs from 'fs-extra';
import { tinyYoloBody, getConstants } from './model-utils/model';
import { lossWrap, yolo_boxes, yolo_nms } from './model-utils/loss';
import { transformTargets } from './model-utils/dataset';

function getAnchors() {
  return tf.tensor([[10,14], [23,27], [37,58], [81,82], [135,169], [344,319]], [6,2], 'float32');
}

function transformBBox(bboxes: number[][], width: number, height: number, labelIds: number[]) {
  bboxes.forEach((box, index2) => {
    box[2] = box[0] + box[2];
    box[3] = box[1] + box[3];
    box[0] = box[0] / width;
    box[1] = box[1] / height;
    box[2] = box[2] / width;
    box[3] = box[3] / height;
    box[4] = labelIds[index2];
  });
  bboxes = bboxes.slice(0, 8);
  if (bboxes.length < 8) {
    bboxes = bboxes.concat(new Array(8 - bboxes.length).fill([0,0,0,0,0]));
  }
  return bboxes;
}


function createTinyModel(inputShape: number[],  anchors: any, numClasses: number, freezeBody: boolean) {
  const imageInput = tf.input({
    shape: [inputShape[0], inputShape[1], 3]
  });
  const modelBody = tinyYoloBody(imageInput, 3, numClasses);
  return modelBody;
}

interface TrainDatasetPool<T extends DataCook.Dataset.Types.Sample, D extends DatasetPool.Types.DatasetMeta> {
  getDatasetMeta: () => Promise<D>;
  test: DataCook.Dataset.Types.Dataset<T>;
  train: DataCook.Dataset.Types.Dataset<T>;
  valid?: DataCook.Dataset.Types.Dataset<T>;
  shuffle: (seed?: string) => void;
}


async function checkTrainDatasetPool(datasetPool: DatasetPool.Types.DatasetPool<TransedSample, ImageDatasetMeta>): Promise<TrainDatasetPool<TransedSample, ImageDatasetMeta>> {
  const meta = await datasetPool.getDatasetMeta();
  if (!meta) {
    throw new TypeError('DatasetMeta cannot be null.');
  }
  if (!datasetPool.train) {
    throw new TypeError('Train dataset cannot be null.');
  }
  if (!datasetPool.test) {
    throw new TypeError('Test dataset cannot be null.');
  }
  if (!meta?.size?.train) {
    throw new TypeError('The size of train dataset is unknown.');
  }
  if (!meta?.size?.test) {
    throw new TypeError('The size of test dataset is unknown.');
  }
  return datasetPool as TrainDatasetPool<TransedSample, ImageDatasetMeta>;
}

const train: ModelEntry<TransedSample, ImageDatasetMeta> = async (api: Runtime<TransedSample, ImageDatasetMeta>, options: Record<string, any>, context: ScriptContext) => {
  const { modelDir } = context.workspace;
  const {
    epochs = 20,
    batchSize = 16
  } = options;
  let tf: any;
  try {
    tf = await context.importJS('@tensorflow/tfjs-node-gpu');
  } catch {
    tf = await context.importJS('@tensorflow/tfjs-node');
  }

  global.tf = tf;

  const dataset = api.dataset;
  const meta = await dataset.getDatasetMeta();
  const { train: trainSize } = meta.size;
  const batchesPerEpoch = Math.floor(trainSize / batchSize);

  const numClasses = Object.keys(meta.labelMap).length;
  const anchors = getAnchors();
  const freezeBody = true;

  const inputShape = [416,416];
  const model = createTinyModel(inputShape, anchors, numClasses, freezeBody);
  const loss = [
    lossWrap(getConstants().yolo_tiny_anchors1, numClasses),
    lossWrap(getConstants().yolo_tiny_anchors2, numClasses)
  ]

  model.compile({
    optimizer: tf.train.rmsprop(1e-3),
    loss: loss
  });

  function makeIterator() {
    const iterator = {
      next: async () => {
        let data = await dataset.train.next();
        if (!data) {
          await dataset.train.seek(0);
          data = await dataset.train.next();
        }
        let bboxes: number[][] = data?.label.map((ele2: any) => ele2.bbox);
        bboxes = JSON.parse(JSON.stringify(bboxes));
        const labels: number[] = data?.label.map((ele2: any) =>Number(ele2.category_id) - 1 );
        bboxes = transformBBox(bboxes, meta.dimension.x, meta.dimension.y, labels);
        const ys = tf.tensor(bboxes);
        return {
          value: {
            xs: data?.data.tensor,
            ys
          },
          done: false
        }
      }
    };
    return iterator;
  }
  let ds = tf.data.generator(makeIterator).batch(batchSize).mapAsync(async (data: any) => {
    const ys = await transformTargets(data.ys, getConstants().yolo_tiny_anchors, 416);
    return {
      xs: data.xs,
      ys
    }
  });

  await model.fitDataset(ds, {
    batchesPerEpoch,
    epochs: epochs,
    callbacks: [
      tf.callbacks.earlyStopping({monitor: 'loss', patience: 3, verbose: 1}),
      tf.node.tensorBoard(`${modelDir}/tensorboard`)
    ]
  })
  await model.save(`file://${modelDir}`);
  await fs.writeJSON(path.join(modelDir, 'categories.json'), meta.categories);
}

let predictModel: tf.LayersModel;
let categories: string[];

const predict = async (api: Runtime<TransedSample, ImageDatasetMeta>, options: Record<string, any>, context: ScriptContext): Promise<PredictResult> => {
  const { modelDir } = context.workspace;

  if (!categories) {
    categories = await fs.readJSON(path.join(modelDir, 'categories.json'));
  }
  if (!predictModel) {
    predictModel = await tf.loadLayersModel(`file://${path.join(modelDir, 'model.json')}`);
  }

  await api.dataset.predicted?.seek(0);
  const dataBatch = await api.dataset.predicted?.nextBatch(1);
  const meta = await api.dataset.getDatasetMeta();

  if (!(dataBatch?.length === 1)) {
    throw new TypeError('no data');
  }

  const tensors = tf.stack(dataBatch.map(ele => ele.data.tensor));
  const result = predictModel.predict(tensors);
  const [output_0, output_1] = result as tf.Tensor[];
  const box0 = yolo_boxes(output_0, getConstants().yolo_tiny_anchors1, 1);
  const box1 = yolo_boxes(output_1, getConstants().yolo_tiny_anchors2, 1);
  const outputs = yolo_nms([box0.slice(0, 3) as any, box1.slice(0, 3) as any]);
  const {
    boxes,
    scores,
    classes,
    valid_detections
  } = outputs;
  const predictResult = [];
  for (let i = 0; i < valid_detections; i++) {
    let boxArr = Array.from(tf.reshape(tf.slice(boxes, [0, i], [1, 1]), [4]).dataSync());
    const scoresArr = tf.reshape(tf.slice(scores, [0, i], [1, 1]), [1]).dataSync();
    const x = meta?.dimension.x as number;
    const y = meta?.dimension.y as number;
    const ratioX = dataBatch[0].data.originSize.width / x;
    const ratioY = dataBatch[0].data.originSize.height / y
    boxArr = [
      boxArr[0] * x * ratioX,
      boxArr[1] * y * ratioY,
      (boxArr[2] - boxArr[0]) * x * ratioX,
      (boxArr[3] - boxArr[1]) * y * ratioY
    ]
    predictResult.push({
      class: categories[tf.reshape(tf.slice(classes, [0, i], [1, 1]), [1]).dataSync()[0]],
      scores: scoresArr[0],
      boxes: boxArr
    })
  }
  return predictResult;
}

export {
  train,
  predict
};
