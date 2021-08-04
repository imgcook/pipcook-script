import * as tf from '@tensorflow/tfjs-node';

export function getConstants() {
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




function DarknetConv2D_BN_Leaky(input: any, filters: number, kernelSize: number[]) {
  let temp = tf.layers.conv2d({
    filters,
    kernelSize,
    useBias: false,
    kernelRegularizer: tf.regularizers.l2({
      l2: 5e-4
    }),
    kernelInitializer: 'glorotUniform',
    padding: 'same',
    biasInitializer: 'zeros',
    dilationRate: [1, 1],
    strides: 1
  }).apply(input);
  temp = tf.layers.batchNormalization().apply(temp);
  temp = tf.layers.leakyReLU({
    alpha: 0.1
  }).apply(temp);
  return temp;
}

function DarknetConv2D(input: any, filters: number, kernelSize: number[]) {
  let temp = tf.layers.conv2d({
    filters,
    kernelSize,
    kernelRegularizer: tf.regularizers.l2({
      l2: 5e-4
    }),
    kernelInitializer: 'glorotUniform',
    padding: 'same',
    biasInitializer: 'zeros',
    dilationRate: [1, 1],
    strides: 1
  }).apply(input);
  return temp;
}

function maxPooling2d(input: any, poolSize: [number, number], strides: [number, number]) {
  const temp = tf.layers.maxPooling2d({
    poolSize,
    strides,
    padding: 'same',
    dataFormat: 'channelsLast'
  }).apply(input);
  return temp;
}

function DarknetTiny(name='') {
  let inputs = tf.layers.input({
    shape: [null, null, 3]
  });
  let temp: any = inputs;
  temp = DarknetConv2D_BN_Leaky(temp, 16, [3, 3]);
  temp = maxPooling2d(temp, [2, 2], [2, 2]);
  temp = DarknetConv2D_BN_Leaky(temp, 32, [3, 3]);
  temp = maxPooling2d(temp, [2, 2], [2, 2]);
  temp = DarknetConv2D_BN_Leaky(temp, 64, [3, 3]);
  temp = maxPooling2d(temp, [2, 2], [2, 2]);
  temp = DarknetConv2D_BN_Leaky(temp, 128, [3, 3]);
  temp = maxPooling2d(temp, [2, 2], [2, 2]);
  temp = DarknetConv2D_BN_Leaky(temp, 256, [3, 3]);
  let x1 = temp;
  temp = maxPooling2d(temp, [2, 2], [2, 2]);
  temp = DarknetConv2D_BN_Leaky(temp, 512, [3, 3]);
  temp = maxPooling2d(temp, [2, 2], [1, 1]);
  temp = DarknetConv2D_BN_Leaky(temp, 1024, [3, 3]);
  return tf.model({
    inputs,
    outputs: [x1, temp],
    name
  });
}

function YoloConvTiny(filters: number, x_in: any, name='') {
  let x: any;
  let inputs: any;
  if (Array.isArray(x_in)) {
    inputs = [ tf.layers.input({
      shape: x_in[0].shape.slice(1)
    }), tf.layers.input({
      shape: x_in[1].shape.slice(1)
    })];
    x = inputs[0];
    let x_skip = inputs[1];
    x = DarknetConv2D_BN_Leaky(x, filters, [1, 1]);
    x = tf.layers.upSampling2d({
      size: [2, 2]
    }).apply(x) as any;
    x = tf.layers.concatenate().apply([x, x_skip]) as any;
  } else {
    x = tf.layers.input({
      shape: x_in.shape.slice(1)
    });
    inputs = x;
    x = DarknetConv2D_BN_Leaky(x, filters, [1, 1]);
  }

  return tf.model({
    inputs,
    outputs: x,
    name
  }).apply(x_in);
}

function YoloOutput(x_in: any, filters: number, anchors: number, numClasses: number, name='') {
  let x: any = tf.layers.input({
    shape: x_in.shape.slice(1)
  });
  let inputs = x;
  x = DarknetConv2D_BN_Leaky(x, filters * 2, [3, 3]);
  x = DarknetConv2D(x, anchors * (numClasses + 5), [1, 1]);
  x = tf.layers.reshape({
    targetShape: [x.shape[1] as number, x.shape[2] as number, anchors, numClasses + 5]
  }).apply(x) as any;
  return tf.model({
    inputs,
    outputs: x,
    name
  });
}

export function tinyYoloBody(imageInput: any, anchors: number, numClasses: number) {
  let [ x_8, x ] = DarknetTiny('yolo_darknet').apply(imageInput) as any;

  x = YoloConvTiny(256, x, 'yolo_conv_0');
  const output_0 = YoloOutput(x, 256, anchors, numClasses, 'yolo_output_0').apply(x);
  x = YoloConvTiny(128, [ x, x_8 ], 'yolo_conv_1');
  const output_1 = YoloOutput(x, 128, anchors, numClasses, 'yolo_output_1').apply(x);

  return tf.model({
    inputs: imageInput,
    outputs: [output_0 as any, output_1 as any]
  });
}
