import { booleanMask, broadcastTo, sparseCategoricalCrossentropy } from './utils';
declare global {
  var tf: any
}

function _meshgrid(n_a: number, n_b: number) {
  const repeatTensor = [];
  for (let i = 0; i < n_b; i++) {
    repeatTensor.push(...new Array(n_a).fill(i));
  }

  return [
    tf.reshape(tf.tile(tf.range(0, n_a), [n_b]), [n_b, n_a]),
    tf.reshape(tf.tensor(repeatTensor), [n_b, n_a])
 ]
}

export function yolo_nms(outputs: tf.Tensor[][]) {
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

export function yolo_boxes(pred: any, anchors: any, classes: number): any {
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

  return [ bbox, objectness, class_probs, pred_box ]
}

function broadcast_dynamic_shape(shape1: number[], shape2: number[]) {
  const arr = [];
  const lengthMax = Math.max(shape1.length, shape2.length);
  shape1 = (new Array(lengthMax - shape1.length).fill(-1)).concat(shape1);
  shape2 = (new Array(lengthMax - shape2.length).fill(-1)).concat(shape2);
  for (let i = 0; i < lengthMax; i++) {
    if (shape1[i] == 0 || shape2[i] == 0) {
      arr[i] = 0;
      continue;
    }
    arr[i] = Math.max(shape1[i], shape2[i]);
  }
  return arr;
}

export function getLastIndex(arr: any, num: number) {
  const shape = arr.shape;
  const one = new Array(shape.length).fill(0);
  one[one.length - 1] = num;
  const two = new Array(shape.length).fill(-1);
  two[two.length - 1] = 1;
  return arr.slice(one, two).reshape(arr.shape.slice(0, arr.shape.length - 1));
}

function broadcast_iou(box_1: any, box_2: any) {
    const originShapeFirst = box_2.shape[0];
    box_1 = tf.expandDims(box_1, -2)
    box_2 = tf.expandDims(box_2, 0)
    const new_shape = broadcast_dynamic_shape(box_1.shape, box_2.shape);
    if (originShapeFirst == 0) {
      return tf.tensor([], new_shape.slice(0, new_shape.length - 1));
    }
    box_1 = broadcastTo(box_1, new_shape);
    box_2 = broadcastTo(box_2, new_shape);

    const int_w = tf.maximum(tf.sub(tf.minimum(getLastIndex(box_1, 2), getLastIndex(box_2, 2)), tf.maximum(getLastIndex(box_1, 0), getLastIndex(box_2, 0))), 0);
    const int_h = tf.maximum(tf.sub(tf.minimum(getLastIndex(box_1, 3), getLastIndex(box_2, 3)), tf.maximum(getLastIndex(box_1, 1), getLastIndex(box_2, 1))), 0);
    const int_area = tf.mul(int_w , int_h);
    const box_1_area = tf.mul(tf.sub(getLastIndex(box_1, 2), getLastIndex(box_1, 0)), tf.sub(getLastIndex(box_1, 3), getLastIndex(box_1, 1)));
    const box_2_area = tf.mul(tf.sub(getLastIndex(box_2, 2), getLastIndex(box_2, 0)), tf.sub(getLastIndex(box_2, 3), getLastIndex(box_2, 1)));
    return tf.div(
      int_area,
      tf.sub(tf.add(box_1_area, box_2_area), int_area)
    )
}
export function lossWrap (anchors: any, classes: number, ignore_thresh=0.5) {
  return function yoloLoss(yTrue: any, yPred: any): any {
    const loss = tf.tidy(() => {
      const [ pred_box, pred_obj, pred_class, pred_xywh ] = yolo_boxes(yPred, anchors, classes);
      const pred_xy = pred_xywh.slice([0,0,0,0,0], [-1,-1,-1,-1,2]);
      const pred_wh = pred_xywh.slice([0,0,0,0,2], [-1,-1,-1,-1,2]);
  
      const [ true_box, true_obj, true_class_idx] = tf.split(
        yTrue, [4, 1, 1], -1) as any
      const trueBox02 = true_box.slice([0,0,0,0,0], [-1,-1,-1,-1,2]);
      const trueBox24 = true_box.slice([0,0,0,0,2], [-1,-1,-1,-1,2]);
      let true_xy = tf.div(tf.add(trueBox02, trueBox24), 2);
      let true_wh = tf.sub(trueBox24, trueBox02);
  
      const true_wh0 = true_wh.slice([0,0,0,0,0], [-1,-1,-1,-1,1]).reshape(true_wh.shape.slice(0, 4));
      const true_wh1 = true_wh.slice([0,0,0,0,1], [-1,-1,-1,-1,1]).reshape(true_wh.shape.slice(0, 4));
      const box_loss_scale = tf.sub(2, tf.mul(true_wh0, true_wh1));
  
      const grid_size = yTrue.shape[1] as number;
      let gridA = tf.meshgrid(tf.range(0, grid_size), tf.range(0, grid_size));
      const grid = tf.expandDims(tf.stack(gridA, -1), 2);
      true_xy = tf.sub(tf.mul(true_xy, tf.cast(grid_size, 'float32')), tf.cast(grid, 'float32'));
      true_wh = tf.log(tf.div(true_wh, anchors));
      true_wh = tf.where(tf.isInf(true_wh), tf.zerosLike(true_wh), true_wh);
      true_wh = tf.where(tf.isNaN(true_wh), tf.zerosLike(true_wh), true_wh);
  
      let obj_mask = tf.squeeze(true_obj, [-1]);
      const best_iou_arr = [];
      for (let i = 0; i < pred_box.shape[0]; i++) {
        const cur_pred_box = pred_box.slice([i], [1]).reshape(pred_box.shape.slice(1));
        const cur_true_box = true_box.slice([i], [1]).reshape(true_box.shape.slice(1));
        const cur_obj_mask = obj_mask.slice([i], [1]).reshape(obj_mask.shape.slice(1));
        const boolean_mask = broadcast_iou(cur_pred_box ,booleanMask(cur_true_box, tf.cast(cur_obj_mask, 'bool')));
        const reduceMax = tf.max(boolean_mask, -1);
        best_iou_arr.push(reduceMax);
      } 
  
      const best_iou = tf.stack(best_iou_arr);
      const ignore_mask = tf.cast(tf.cast(tf.sub(tf.minimum(best_iou,ignore_thresh), ignore_thresh), 'bool'), 'float32');
      
  
      let xy_loss = tf.mul(tf.mul(obj_mask, box_loss_scale), tf.sum(tf.square(tf.sub(true_xy, pred_xy)), -1));
      let wh_loss = tf.mul(tf.mul(obj_mask, box_loss_scale), tf.sum(tf.square(tf.sub(true_wh, pred_wh)), -1));
  
      let obj_loss = tf.metrics.binaryCrossentropy(true_obj, pred_obj);
      obj_loss = tf.add(tf.mul(obj_mask, obj_loss), tf.mul(tf.mul(tf.sub(1, obj_mask), ignore_mask), obj_loss));
      let class_loss = tf.mul(obj_mask, sparseCategoricalCrossentropy(true_class_idx, pred_class));
      xy_loss = tf.sum(xy_loss, [1, 2, 3]);
      wh_loss = tf.sum(wh_loss, [1,2,3]);
      obj_loss = tf.sum(obj_loss, [1,2,3]);
      class_loss = tf.sum(class_loss, [1,2,3]);
  
      return tf.sum(tf.add(tf.add(tf.add(xy_loss, wh_loss), obj_loss), class_loss));
    });
    return loss;
   
  }
}

