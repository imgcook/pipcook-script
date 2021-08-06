import { DataCook, DatasetPool } from '@pipcook/core';
import * as tf from '@tensorflow/tfjs-core';

export type TransedSample = DataCook.Dataset.Types.Sample<{tensor: tf.Tensor3D, originSize: { width: number, height :number }}, DataCook.Dataset.Types.ObjectDetection.Label>;
