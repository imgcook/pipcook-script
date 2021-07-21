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

export function getCustom(reps: any) {
  const customTile = tf.customGrad((x: any, save: any) => {
    save([x]);
    return {
      value: tf.tile(x, reps),
      gradFunc: (dy: any, saved: any) => {
        const [x] = saved;
        const derX = () => {
          let xGrad = tf.zerosLike(x);
          if (x.rank === 1) {
            for (let i = 0; i < reps[0]; ++i) {
              xGrad = tf.add(xGrad, tf.slice(dy, [i * x.shape[0]], [x.shape[0]]));
            }
          } else if (x.rank === 2) {
            for (let i = 0; i < reps[0]; ++i) {
              for (let j = 0; j < reps[1]; ++j) {
                xGrad = tf.add(xGrad, tf.slice(dy, [i * x.shape[0], j * x.shape[1]], [
                  x.shape[0], x.shape[1]
                ]));
              }
            }
          } else if (x.rank === 3) {
            for (let i = 0; i < reps[0]; ++i) {
              for (let j = 0; j < reps[1]; ++j) {
                for (let k = 0; k < reps[2]; ++k) {
                  xGrad =
                  tf.add(xGrad,
                    tf.slice(
                      dy, [i * x.shape[0], j * x.shape[1], k * x.shape[2]],
                      [x.shape[0], x.shape[1], x.shape[2]]));
                }
              }
            }
          } else if (x.rank === 4) {
            for (let i = 0; i < reps[0]; ++i) {
              for (let j = 0; j < reps[1]; ++j) {
                for (let k = 0; k < reps[2]; ++k) {
                  for (let l = 0; l < reps[3]; ++l) {
                    xGrad =
                    tf.add(xGrad,
                      tf.slice(
                        dy,
                        [
                          i * x.shape[0], j * x.shape[1], k * x.shape[2],
                          l * x.shape[3]
                        ],
                        [x.shape[0], x.shape[1], x.shape[2], x.shape[3]]));
                  }
                }
              }
            }
          } else if (x.rank === 5) {
            for (let i = 0; i < reps[0]; ++i) {
              for (let j = 0; j < reps[1]; ++j) {
                for (let k = 0; k < reps[2]; ++k) {
                  for (let l = 0; l < reps[3]; ++l) {
                    for (let m = 0; m < reps[4]; ++m) {
                      xGrad =
                      tf.add(xGrad,
                        tf.slice(
                          dy,
                          [
                            i * x.shape[0], j * x.shape[1], k * x.shape[2],
                            l * x.shape[3], m * x.shape[4]
                          ],
                          [x.shape[0], x.shape[1], x.shape[2], x.shape[3], x.shape[4]]));
                    }
                  }
                }
              }
            }
          } else {
            throw new Error(
                `Gradient for tile operation is not implemented for rank-` +
                `${x.rank} tensors yet.`);
          }
          return xGrad;
        };
        return derX();
      }
    }
  });
  return customTile;
}


export function broadcastTo(x: any, shape: any[]) {
  let input = x;
  const xShape = input.shape;

  if (shape.length > input.rank) {
    const newShape = input.shape.slice();
    while (newShape.length < shape.length) {
      newShape.unshift(1);
    }
    input = tf.reshape(input, newShape);
  }

  const inputShape = input.shape;
  const reps: number[] = Array.from(shape);
  for (let i = shape.length - 1; i >= 0; i--) {
    if (inputShape[i] === shape[i]) {
      reps[i] = 1;
    } else if (input.shape[i] !== 1) {
      throw new Error(
          `broadcastTo(): [${xShape}] cannot be broadcast to [${shape}].`);
    }
  }
  const axes = reps.map((n, i) => n > 1 ? i : -1).filter(i => i >= 0);

  if (axes.length === 0) {
    return tf.clone(input);
  }

  return getCustom(reps)(input);
}