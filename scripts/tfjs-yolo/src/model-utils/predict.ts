/**
 * This file should be single-included file without any deps with other files in this project
 */

import * as tf from '@tensorflow/tfjs-node';

async function createModel(model: tf.LayersModel) {
}

async function predict() {
  const model = await tf.loadLayersModel('file:///Users/caoruikun/Documents/work/pipcook/yolov3-tf2/20210703121857/model/model.json');
  const result = model.predict(tf.ones([1, 416, 416, 3]));
  const [ output0, output1 ] = result as tf.Tensor[];
  
}

predict();