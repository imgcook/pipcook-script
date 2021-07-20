import { ModelEntry, Runtime, ScriptContext } from '@pipcook/core';
import type { Dataset } from '@pipcook/datacook';
import { tinyYoloBody, getConstants } from './model-utils/model';
import { lossWrap } from './model-utils/loss';
import { transformTargets } from './model-utils/dataset';

function getAnchors() {
  return tf.tensor([[10,14], [23,27], [37,58], [81,82], [135,169], [344,319]], [6,2], 'float32');
}

function transformBBox(bboxes: number[][][], width: number, height: number, labelIds: number[][]) {
  const res = bboxes.map((bbox, index) => {
    bbox.forEach((box, index2) => {
      box[2] = box[0] + box[2];
      box[3] = box[1] + box[3];
      box[0] = box[0] / width;
      box[1] = box[1] / height;
      box[2] = box[2] / width;
      box[3] = box[3] / height;
      box[4] = labelIds[index][index2];
    });
    bbox = bbox.slice(0, 8);
    if (bbox.length < 8) {
      bbox = bbox.concat(new Array(8 - bbox.length).fill([0,0,0,0,0]));
    }
    return bbox;
  })
  return res;
}


function createTinyModel(inputShape: number[],  anchors: any, numClasses: number, freezeBody: boolean) {
  const imageInput = tf.input({
    shape: [inputShape[0], inputShape[1], 3]
  });
  const modelBody = tinyYoloBody(imageInput, 3, numClasses);
  return modelBody;
}

const main: ModelEntry<Dataset.Types.Sample, Dataset.Types.ImageDatasetMeta> = async (api: Runtime<Dataset.Types.Sample, Dataset.Types.ImageDatasetMeta>, options: Record<string, any>, context: ScriptContext) => {
  const { modelDir } = context.workspace;
  const {
    epochs = 10,
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

  for (let i = 0; i < epochs; i++) {
    console.log(`Epoch ${i}/${epochs} start`);
    await dataset.train.seek(0);
    for (let j = 0; j < batchesPerEpoch; j++) {
      const dataBatch = await dataset.train.nextBatch(batchSize);
      const xs = tf.tidy(() => tf.stack(dataBatch.map((ele) => ele.data)));
      const ys = tf.tidy(() => {
        let bboxes: number[][][] = dataBatch.map(ele => ele.label.map((ele2: any) => ele2.bbox));
        const labels: number[][] = dataBatch.map(ele => ele.label.map((ele2: any) => Number(ele2.category_id) - 1));
        bboxes = transformBBox(bboxes, meta.dimension.x, meta.dimension.y, labels);
        const ys = tf.tensor(bboxes);
        return ys;
      });
      const yss = (await transformTargets(ys, getConstants().yolo_tiny_anchors, 416));
      const res = await model.trainOnBatch(xs, yss);
      if (j % (Math.floor(batchesPerEpoch / 10)) === 0) {
        console.log(`epoch ${i} - iteration ${j}: total loss is ${res[0]}`);
      }
    }
  }
  await model.save(`file://${modelDir}`);
}

export default main;
