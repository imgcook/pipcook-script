declare global {
  var tf: any
}

function whereImpl(condShape: number[], condVals: any) {
  const indices = [];
  for (let i = 0; i < condVals.length; i++) {
    if (condVals[i]) {
      indices.push(i);
    }
  }

  const inBuffer = global.tf.buffer(condShape, 'int32');

  const out = tf.buffer([indices.length, condShape.length], 'int32');
  for (let i = 0; i < indices.length; i++) {
    const loc = inBuffer.indexToLoc(indices[i]);
    const offset = i * condShape.length;
    out.values.set(loc, offset);
  }
  return out.toTensor();
}

function where(condition: any) {
  const vals = condition.dataSync();
  const res = whereImpl(condition.shape, vals);
  return res;
}

export function booleanMask(
  tensor: any, mask: any,
  axis?: number): any {
  const $tensor = tensor;
  const $mask = mask;

  const axisFrom = axis == null ? 0 : axis;
  const maskDim = $mask.rank;
  const tensorShape = $tensor.shape;

  let leadingSize = 1;
  for (let i = axisFrom; i < axisFrom + maskDim; i++) {
    leadingSize *= tensorShape[i];
  }
  const targetTensorShape =
      tensorShape.slice(0, axisFrom)
          .concat([leadingSize], tensorShape.slice(axisFrom + maskDim));
  const reshapedTensor = tf.reshape($tensor, targetTensorShape);
  const reshapedMask = tf.reshape($mask, [-1]);
  const positivePositions = where(reshapedMask);
  const indices = tf.squeeze(positivePositions, [1]);
  const res = tf.gather(reshapedTensor, indices, axisFrom);

  // Ensure no memory leak.
  if (tensor !== $tensor) {
    $tensor.dispose();
  }
  if (mask !== $mask) {
    $mask.dispose();
  }
  indices.dispose();
  reshapedTensor.dispose();
  reshapedMask.dispose();
  positivePositions.dispose();

  return res;
}

export function sigmoidCrossEntropyWithLogits(
  labels: any, logits: any) {
  const $labels = labels;
  const $logits = logits;
  const maxOutput = tf.relu($logits);
  const outputXTarget = tf.mul($logits, $labels);
  const sigmoidOutput = tf.log1p(tf.exp(tf.neg(tf.abs($logits))));

  return tf.add(tf.sub(maxOutput, outputXTarget), sigmoidOutput);
}

export function sparseCategoricalCrossentropy(
  target: any, output: any): any {
    const flatTarget = tf.floor(tf.reshape(target, [-1])).toInt();
    output = tf.clipByValue(output, tf.backend().epsilon(), 1 - tf.backend().epsilon());
    const outputShape = output.shape;
    let oneHotTarget;
    if (outputShape[outputShape.length - 1] > 1) {
      oneHotTarget =
      tf.oneHot(flatTarget, outputShape[outputShape.length - 1])
          .reshape(outputShape);
    } else {
      oneHotTarget = flatTarget.reshape(outputShape);
    }
    return tf.metrics.categoricalCrossentropy(oneHotTarget, output);
}
