import { DatasetPool } from '@pipcook/core';
import * as tf from '@tensorflow/tfjs-core';

export interface TransedSample {
  data: tf.Tensor3D,
  label: string
}

export interface TransedMetadata extends DatasetPool.Types.ImageClassification.DatasetMeta {
  dimension: {
    x: number;
    y: number;
    z: number;
  }
}
