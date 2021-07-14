import * as path from 'path';
import * as tf from '@tensorflow/tfjs-node';
import Jimp from 'jimp';
import { getLastIndex } from './loss';
import { yolo_tiny_anchor_masks } from './model';


export async function load_fake_dataset() {
  const imageBitMap = await Jimp.read(path.join(__dirname, '../../data/girl.png'));
  const buffer = await imageBitMap.getBufferAsync(Jimp.MIME_JPEG);
  let image = await tf.node.decodeJpeg(buffer)

  let labels = tf.tensor([
      [0.18494931, 0.03049111, 0.9435849,  0.96302897, 0],
      [0.01586703, 0.35938117, 0.17582396, 0.6069674, 56],
      [0.09158827, 0.48252046, 0.26967454, 0.6403017, 67],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0]
  ], [8, 5], 'float32');
  return tf.data.array([{
    xs: image,
    ys: labels
  }])
}

export async function transformTargets(y_train: tf.Tensor, anchors: tf.Tensor, size: number) {
  const y_outs = [];
  let grid_size = Math.floor(size / 32);

  anchors = tf.cast(anchors, 'float32');
  let anchor_area = tf.mul(
    getLastIndex(anchors, 0),
    getLastIndex(anchors, 1)
  );
  let box_wh = tf.sub(
    y_train.slice([0, 0, 2], [-1, -1, 2]),
    y_train.slice([0, 0, 0], [-1, -1, 2]),
  );
  box_wh = tf.tile(tf.expandDims(box_wh, -2), [1, 1, anchors.shape[0], 1]);
  let box_area = tf.mul(
    getLastIndex(box_wh, 0),
    getLastIndex(box_wh, 1)
  );
  let intersection = tf.mul(tf.minimum(
    getLastIndex(box_wh, 0),
    getLastIndex(anchors, 0)
  ), tf.minimum(
    getLastIndex(box_wh, 1),
    getLastIndex(anchors, 1)
  ));
  let iou = tf.div(
    intersection,
    tf.sub(tf.add(box_area, anchor_area), intersection)
  );
  let anchor_idx = tf.cast(tf.argMax(iou, -1), 'float32');
  anchor_idx = tf.expandDims(anchor_idx, -1);

  y_train = tf.concat([y_train, anchor_idx], -1);

  for (const anchor_idxs of yolo_tiny_anchor_masks) {
    y_outs.push(
      (await transform_targets_for_output(y_train, grid_size, anchor_idxs))
    )
    grid_size *= 2;
  }

  return y_outs;
}

export function getSingle(x: tf.Tensor, position: number[]) {
  return x.slice(position, new Array(position.length).fill(1)).reshape([1]);
}

export async function transform_targets_for_output(y_true: tf.Tensor, grid_size: number, anchor_idxss: number[]) {
  const N = y_true.shape[0];
  const y_true_out = tf.zeros([N, grid_size, grid_size, anchor_idxss.length, 6]);
  let anchor_idxs = tf.tensor(anchor_idxss);
  anchor_idxs = tf.cast(anchor_idxs, 'int32');
  const indexes = [];
  const updates = [];
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < (y_true.shape[1] as number); j++) {
      if (tf.equal(getSingle(y_true, [i, j ,2]), 0).dataSync()[0]) {
        continue;
      }
      let anchor_eq = tf.equal(
        anchor_idxs, tf.cast(getSingle(y_true, [i, j, 5]), 'int32')
      )

      if (tf.any(anchor_eq).dataSync()[0]) {
        let box = y_true.slice([i, j, 0], [1, 1, 4]).reshape([4]);
        let box_xy = tf.div(tf.add(
          y_true.slice([i, j, 0], [1, 1, 2]).reshape([2]),
          y_true.slice([i, j, 2], [1, 1, 2]).reshape([2])
        ), 2);
        let anchor_idx = tf.cast((await tf.whereAsync(anchor_eq)), 'int32');
        let grid_xy = tf.cast(tf.floorDiv(box_xy, tf.div(1, grid_size)), 'int32');

        indexes.push([i, grid_xy.slice([1], [1]).reshape([1]).dataSync()[0], grid_xy.slice([0], [1]).reshape([1]).dataSync()[0], anchor_idx.slice([0,0], [1,1]).reshape([1]).dataSync()[0]]);
        updates.push(
          [
          box.slice([0], [1]).reshape([1]).dataSync()[0],
          box.slice([1], [1]).reshape([1]).dataSync()[0],
          box.slice([2], [1]).reshape([1]).dataSync()[0],
          box.slice([3], [1]).reshape([1]).dataSync()[0],
          1,
          y_true.slice([i, j, 4], [1,1,1]).reshape([1]).dataSync()[0]
          ]
        )
      }
    }
  }
  const buffer = await y_true_out.bufferSync();
  for (let i = 0; i < indexes.length; i++) {
    let index = indexes[i];
    let update = updates[i];
    for (let j = 0; j < update.length; j++) {
      buffer.set(
        update[j],
        ...(index.concat([j])),
      )
    }
  }
  return buffer.toTensor();
}

export function transform_images(image: tf.Tensor3D, size: [number, number]) {
  return tf.div(tf.image.resizeBilinear(image, size), 255);
}