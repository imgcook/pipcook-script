import * as tf from '@tensorflow/tfjs-node';
import jimp from 'jimp';

function getConstants() {
  const yolo_tiny_anchors1 = tf.div(tf.tensor([
    [81, 82], [135, 169],  [344, 319]], [3, 2], 'float32'), 416);

  const yolo_tiny_anchors2 = tf.div(tf.tensor([[10, 14], [23, 27], [37, 58]], [3, 2], 'float32'), 416);
  const yolo_tiny_anchor_masks = [[3,4,5], [0,1,2]];
  const yolo_tiny_anchors = tf.div(tf.tensor([[10, 14], [23, 27], [37, 58],
    [81, 82], [135, 169],  [344, 319]], [6,2], 'float32'), 416);

  return {
    yolo_tiny_anchors1,
    yolo_tiny_anchors2,
    yolo_tiny_anchor_masks,
    yolo_tiny_anchors
  }
}

function _meshgrid(n_a: number, n_b: number) {
  const repeatTensor = [];
  for (let i = 0; i < n_a; i++) {
    repeatTensor.push(tf.range(0, n_b));
  }

  return [
    tf.reshape(tf.tile(tf.range(0, n_a), [n_b]), [n_b, n_a]),
    tf.reshape(tf.stack(repeatTensor), [n_b, n_a])
 ]
}

function yolo_boxes(pred: tf.Tensor, anchors: tf.Tensor, classes: number) {
  const gridSize = pred.shape.slice(1, 3);
  let [ box_xy, box_wh, objectness, class_probs ] = tf.split(pred, [2, 2, 1, classes], -1);
  box_xy = tf.sigmoid(box_xy);
  objectness = tf.sigmoid(objectness);
  class_probs = tf.sigmoid(class_probs);
  let pred_box = tf.concat([box_xy, box_wh], -1);

  let grid: any = _meshgrid(gridSize[1], gridSize[0]);
  grid = tf.expandDims(tf.stack(grid, -1), 2);
  box_xy = tf.div(tf.add(box_xy, tf.cast(grid, 'float32')), tf.cast(gridSize, 'float32'));

  box_wh = tf.mul(tf.exp(box_wh), anchors);

  let box_x1y1 = tf.sub(box_xy, tf.div(box_wh, 2));
  let box_x2y2 = tf.add(box_xy, tf.div(box_wh, 2));
  let bbox = tf.concat([box_x1y1, box_x2y2], -1);
  console.log(tf.sum(pred_box).dataSync())

  return [ bbox, objectness, class_probs, pred_box ]
}

function yolo_nms(outputs: tf.Tensor[][]) {
  const b: tf.Tensor[] = [], c: tf.Tensor[] = [], t: tf.Tensor[] = [];
  for (const o of outputs) {
    b.push(tf.reshape(o[0], [o[0].shape[0], -1, o[0].shape[o[0].shape.length - 1]]));
    c.push(tf.reshape(o[1], [o[1].shape[0], -1, o[1].shape[o[1].shape.length - 1]]));
    t.push(tf.reshape(o[2], [o[2].shape[0], -1, o[2].shape[o[2].shape.length - 1]]));
  }  

  let bbox = tf.concat(b, 1);
  const confidence = tf.concat(c, 1);
  const class_probs = tf.concat(t, 1);
  let scores = tf.mul(confidence, class_probs);
  const dscores = tf.squeeze(scores, [0]);
  scores = tf.max(dscores, [1]);
  bbox = tf.reshape(bbox, [-1, 4]);
  let classes = tf.argMax(dscores, 1);
  const nonMaxScores = tf.image.nonMaxSuppressionWithScore(bbox as tf.Tensor2D, scores as tf.Tensor1D, 8, 0.5, 0.5);
  let { selectedIndices, selectedScores } = nonMaxScores;
  const num_valid_nms_boxes = selectedIndices.shape[0];
  selectedIndices = tf.concat([selectedIndices, tf.zeros([8 - num_valid_nms_boxes], 'int32')], 0);
  selectedScores = tf.concat([selectedScores, tf.zeros([8 - num_valid_nms_boxes], 'float32')], -1);
  let boxes = tf.gather(bbox, selectedIndices)
  boxes = tf.expandDims(boxes, 0);
  scores=selectedScores;
  scores = tf.expandDims(scores, 0);
  classes = tf.gather(classes, selectedIndices);
  classes = tf.expandDims(classes, 0);
  let valid_detections = num_valid_nms_boxes;
  return {
    boxes,
    scores,
    classes,
    valid_detections
  }

}

async function predict() {
  const model = await tf.loadLayersModel('file:///Users/caoruikun/Documents/work/pipcook/pipcook-script/test/20210702124526/model/model.json');
  const image = await jimp.read('/Users/caoruikun/Documents/work/pipcook/pipcook-script/test/20210702124526/data/train/f984d880-1cb6-11ea-a3c0-69b27346a20f-screenshot.png');
  let imageTensor = tf.browser.fromPixels({
    data: image.bitmap.data,
    height: image.bitmap.height,
    width: image.bitmap.width
  })
  imageTensor = tf.div(tf.image.resizeBilinear(imageTensor, [416, 416]), 255);
  imageTensor = tf.expandDims(imageTensor, 0)
  const result = model.predict(imageTensor);
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
  console.log('detections: ');
  for (let i = 0; i < valid_detections; i++) {
    console.log(`class: ${classes.slice([0, i], [1, 1]).reshape([1])}, scores: ${scores.slice([0, i], [1, 1])}, boxes: ${boxes.slice([0, i], [1, 1])}`);
  }
}

predict();
