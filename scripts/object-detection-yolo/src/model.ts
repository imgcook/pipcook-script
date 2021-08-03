import { DataCook, DatasetPool, ModelEntry, Runtime, ScriptContext } from '@pipcook/core';
import * as tf from '@tensorflow/tfjs-node';
import { tinyYoloBody, getConstants } from './model-utils/model';
import { lossWrap } from './model-utils/loss';
import { transformTargets } from './model-utils/dataset';
import { TransedSample, ImageDatasetMeta } from './types';

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

const main: ModelEntry<TransedSample, ImageDatasetMeta> = async (api: Runtime<TransedSample, ImageDatasetMeta>, options: Record<string, any>, context: ScriptContext) => {
  const { modelDir } = context.workspace;
  const {
    epochs = 20,
    batchSize = 16
  } = options;

  const dataset = await checkTrainDatasetPool(api.dataset);
  const meta = await dataset.getDatasetMeta();
  if (!meta) {
    throw new TypeError('DatasetMeta cannot be null.');
  }
  if (!dataset.train) {
    throw new TypeError('Train dataset cannot be null.');
  }
  if (!meta?.size?.train) {
    throw new TypeError('The size of train dataset is unknown.');
  }
  if (!Array.isArray(meta.categories) || meta.categories.length === 0) {
    throw new TypeError('Categories is invalid.');
  }
  const { train: trainSize } = meta.size;
  const batchesPerEpoch = Math.floor(trainSize / batchSize);

  const numClasses = meta.categories.length;
  const anchors = getAnchors();
  const freezeBody = true;

  const inputShape = [ 416, 416 ];
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
          if (!data) {
            throw new TypeError('Read sample error.');
          }
        }
        const bboxes = data.label.map((ele2) => ele2.bbox);
        const labels = data.label.map((ele2) => meta.categories?.indexOf(ele2.name)) as number[];
        const transedBboxes = transformBBox(bboxes, meta.dimension.x, meta.dimension.y, labels);
        const ys = tf.tensor(transedBboxes);
        return {
          value: {
            xs: data?.data,
            ys
          },
          done: false
        }
      }
    };
    return iterator;
  }
  let ds = tf.data.generator(makeIterator as any).batch(batchSize).mapAsync(async (data: any) => {
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
}

export default main;
