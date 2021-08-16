<<<<<<< HEAD
import { ModelEntry, Runtime, ScriptContext, DatasetPool, DataCook } from '@pipcook/core';
=======
import { ModelEntry, ScriptContext, DatasetPool, DataCook } from '@pipcook/core';
import * as tf from '@tensorflow/tfjs-node';
>>>>>>> fe00a8e14b66b37e1895b56297fe223295f18bda
import Dataset = DataCook.Dataset;

function createModel(featureNumbers: number) {
  const model = tf.sequential();
  model.add(tf.layers.dense({
    inputShape: [featureNumbers],
    units: 100,
    kernelInitializer: 'truncatedNormal',
    biasInitializer: 'zeros'
  }));
  model.add(tf.layers.leakyReLU());
  model.add(tf.layers.dense({
    units: 50,
    kernelInitializer: 'truncatedNormal',
    biasInitializer: 'zeros'
  }));
  model.add(tf.layers.leakyReLU());
  model.add(tf.layers.dense({
    units: 1,
    kernelInitializer: 'truncatedNormal',
    biasInitializer: 'zeros',
    activation: 'sigmoid'
  }));
  return model;
}

const main: ModelEntry<Dataset.Types.Sample, DatasetPool.Types.TableDatasetMeta> = async (api, options: Record<string, any>, context: ScriptContext) => {
  const { modelDir } = context.workspace;
  const {
    epochs = 10,
    batchSize = 16
  } = options;
  if (!api.dataset.train) {
    throw new TypeError('No train data found.');
  }
  if (!api.dataset.train) {
    throw new TypeError('No train data found.');
  }
  const meta = await api.dataset.getDatasetMeta();
  const featureNumbers = meta?.dataKeys?.length as number;
  const model = createModel(featureNumbers);

  model.compile({
    optimizer: tf.train.adam(1e-3),
    loss: tf.losses.sigmoidCrossEntropy,
    metrics: 'accuracy'
  });

  for (let i = 0; i < epochs; i++) {
    console.log(`Epoch ${i}/${epochs} start`);
    await api.dataset.train.seek(0);
    let j = 0;
    while(true) {
      let batch = await api.dataset.train?.nextBatch(batchSize);
      batch = batch.filter((ele: any) => (ele.label !== undefined && ele.label !== null));
      if (!(batch.length > 0)) {
        break;
      }
      const xs = tf.tidy(() => tf.stack(batch.map((ele) => ele.data)));
      const ys = tf.tidy(() => tf.stack(batch.map((ele) => ele.label)));
      const res = await model.trainOnBatch(xs, ys);
      if (j % 10 === 0) {
        console.log(`Epoch ${i} - Iteration ${j} : loss is ${(res as any)[0]} and accuracy is ${(res as any)[1]}`);
      }
    }
  }

  await model.save(`file://${modelDir}`);
}

export default main;
