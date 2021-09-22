const tf = require('@tensorflow/tfjs-node');

const model = tf.sequential();
model.save('file:///Users/feiyu.zfy/work/pipcook-script/scripts/object-detection-yolo');
