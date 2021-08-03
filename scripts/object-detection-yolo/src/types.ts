import { DataCook, DatasetPool } from '@pipcook/core';
import * as tf from '@tensorflow/tfjs-core';

export interface ImageDatasetMeta extends DatasetPool.Types.ObjectDetection.DatasetMeta {
  dimension: {
    x: number;
    y: number;
    z: number;
  }
}

export type TransedSample = DataCook.Dataset.Types.Sample<tf.Tensor3D, DataCook.Dataset.Types.ObjectDetection.Label>;
