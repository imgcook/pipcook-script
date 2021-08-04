import { DataCook, DataflowEntry, DatasetPool } from '@pipcook/core';
import { TransedSample as OUT_SAMPLE, TransedMetadata as OUT_META } from './types';

import IN_SAMPLE = DataCook.Dataset.Types.ImageClassification.Sample;
import IN_META = DatasetPool.Types.ImageClassification.DatasetMeta;

const resizeEntry: DataflowEntry<IN_SAMPLE, IN_META, OUT_SAMPLE, OUT_META> =
  async (dataset, options, _): Promise<DatasetPool.Types.DatasetPool<OUT_SAMPLE, OUT_META>> => {
  const [ x = '-1', y = '-1' ] = options['size'];
  const { normalize = false } = options;

  const parsedX = parseInt(x);
  const parsedY = parseInt(y);
  if (parsedX == -1 || parsedY == -1) {
    throw new TypeError('The paremeter \'size\' should be specified as \'size=128&size=128\'.');
  };
  dataset.train?.seek(0);
  dataset.test?.seek(0);
  dataset.valid?.seek(0);
  dataset.predicted?.seek(0);
  const sample = await (dataset.train?.next() || dataset.test?.next() || dataset.valid?.next() || dataset.predicted?.next());
  if (!sample) {
    throw new TypeError('No data found in dataset pool.');
  }
  let img: DataCook.Image;
  if (sample.data.uri) {
    img = (await DataCook.Image.read(sample.data.uri)).resize(parsedX, parsedY);
  } else if (sample.data.buffer) {
    img = (await DataCook.Image.read(sample.data.buffer)).resize(parsedX, parsedY);
  } else {
    throw new TypeError('No \'uri\' or \'buffer\' found in sample.');
  }
  const channel = img.channel;
  dataset.train?.seek(0);
  dataset.test?.seek(0);
  dataset.valid?.seek(0);
  dataset.predicted?.seek(0);

  return dataset.transform({
    transform: async (sample): Promise<OUT_SAMPLE> => {
      if (!sample.data.uri && !sample.data.buffer) {
        throw new TypeError('Invalid sample.');
      }
      let img: DataCook.Image;
      if (sample.data.uri) {
        img = (await DataCook.Image.read(sample.data.uri)).resize(parsedX, parsedY);
      } else if (sample.data.buffer) {
        img = (await DataCook.Image.read(sample.data.buffer)).resize(parsedX, parsedY);
      } else {
        throw new TypeError('No \'uri\' or \' buffer\' found in sample.');
      }
      if (normalize) return {
        data: DataCook.Image.normalize(img.toTensor()),
        label: sample.label
      }
      return {
        data: img.toTensor(),
        label: sample.label
      };
    },
    metadata: async (meta?): Promise<OUT_META> => {
      return {
        ...meta,
        type: DataCook.Dataset.Types.DatasetType.Image,
        dimension: {
          x: parsedX,
          y: parsedY,
          z: channel
        }
      };
    }
  });
}

/**
 * this is the data process plugin to process pasvoc format data. It supports resize the image and normalize the image
 * @param resize =[256, 256][optional] resize all images to same size
 * @param normalize =false[optional] if normalize all images to have values between [0, 1]
 */
export default resizeEntry;
