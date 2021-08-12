import { getLastIndex } from './loss';
import { getConstants } from './model';
import * as tf from '@tensorflow/tfjs-node';


export function transformTargets(y_train: any, anchors: any, size: number) {
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

  for (const anchor_idxs of getConstants().yolo_tiny_anchor_masks) {
    y_outs.push(
      (transform_targets_for_output(y_train, grid_size, anchor_idxs))
    )
    grid_size *= 2;
  }

  return y_outs;
}

export function getSingle(x: any, position: number[]) {
  return x.slice(position, new Array(position.length).fill(1)).reshape([1]);
}

export function whereImpl(condition: tf.Tensor) {
  const vals = condition.dataSync();
  const condShape = condition.shape;
  const condVals = vals;
  const indices = [];
  for (let i = 0; i < condVals.length; i++) {
    if (condVals[i]) {
      indices.push(i);
    }
  }

  const inBuffer = tf.buffer(condShape, 'int32');

  const out = tf.buffer([indices.length, condShape.length], 'int32');
  for (let i = 0; i < indices.length; i++) {
    const loc = inBuffer.indexToLoc(indices[i]);
    const offset = i * condShape.length;
    out.values.set(loc, offset);
  }
  return out.toTensor() as tf.Tensor2D;
}

export function transform_targets_for_output(y_true: any, grid_size: number, anchor_idxss: number[]) {
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
        let anchor_idx = tf.cast((whereImpl(anchor_eq)), 'int32');
        let grid_xy = tf.cast(tf.floorDiv(box_xy, tf.div(1, grid_size)), 'int32');

        indexes.push([i, (grid_xy as any).slice([1], [1]).reshape([1]).dataSync()[0], (grid_xy as any).slice([0], [1]).reshape([1]).dataSync()[0], (anchor_idx as any).slice([0,0], [1,1]).reshape([1]).dataSync()[0]]);
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
  const buffer = y_true_out.bufferSync();
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

export function transform_images(image: any, size: [number, number]) {
  return tf.div(tf.image.resizeBilinear(image, size), 255);
}
