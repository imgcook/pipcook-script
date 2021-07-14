import * as tf from '@tensorflow/tfjs-node';
import { tinyYoloBody, yolo_tiny_anchors, yolo_tiny_anchors1, yolo_tiny_anchors2 } from './model/model';
import { lossWrap } from './model/loss';
import { load_fake_dataset, transformTargets, transform_images } from './model/dataset';

function getAnchors() {
  return tf.tensor([[10,14], [23,27], [37,58], [81,82], [135,169], [344,319]], [6,2], 'float32');
}

async function main() {
  let dataset: tf.data.Dataset<any> = await load_fake_dataset();
  dataset = dataset.shuffle(512);
  dataset = dataset.batch(32);
  // @ts-ignore
  dataset = dataset.mapAsync(async (value: any) => {
    return {
      xs: transform_images(value.xs, [416, 416]),
      ys: (await transformTargets(value.ys, yolo_tiny_anchors, 416))
    }
  });

  const numClasses = 80;
  const anchors = getAnchors();
  const freezeBody = true;

  const inputShape = [416,416];
  const model = createTinyModel(inputShape, anchors, numClasses, freezeBody);
  const loss = [
    lossWrap(yolo_tiny_anchors1, numClasses),
    lossWrap(yolo_tiny_anchors2, numClasses)
  ]

  model.compile({
    optimizer: tf.train.adam(1e-3),
    loss: loss
  });

  const optimizer = tf.train.adam(1e-3);
  while(true) {
    //@ts-ignore
    await dataset.forEachAsync(async (e) => {
      optimizer.minimize(() => {
        const images = e.xs
        const labels = e.ys;
        const outputs: any = model.predict(images);
        const cuross = loss[0](labels[0], outputs[0]);
        const cuross2 = loss[1](labels[1], outputs[1]);
        const allLoss = tf.sum(tf.stack(model.calculateLosses()));
        const currentLoss = tf.add(tf.add(cuross, cuross2), allLoss);
        return tf.sum(currentLoss);
      })
    });
  }
}

function  createTinyModel(inputShape: number[],  anchors: tf.Tensor<tf.Rank>, numClasses: number, freezeBody: boolean) {
  const imageInput = tf.input({
    shape: [inputShape[0], inputShape[1], 3]
  });
  const modelBody = tinyYoloBody(imageInput, 3, numClasses);
  return modelBody;
}


main();