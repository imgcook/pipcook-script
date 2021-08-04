import type * as Datacook from '@pipcook/datacook';
import { DataCook, DataflowEntry, ScriptContext, DatasetPool } from '@pipcook/core';
import { ImageDatasetMeta, TransedSample } from './types';

//@ts-ignore
const resizeEntry: DataflowEntry<Datacook.Dataset.Types.Sample, Datacook.Dataset.Types.ImageDatasetMeta> =
  async (dataset: Datacook.Dataset.Types.Dataset<Datacook.Dataset.Types.Sample, any>, options: Record<string, any>, context: ScriptContext)  => {
  const [ x = '-1', y = '-1' ] = options['size'];

  const parsedX = parseInt(x);
  const parsedY = parseInt(y);
  if (parsedX == -1 || parsedY == -1) {
    throw new TypeError('Paremeter `size` is invlaid.');
  }
  return await DatasetPool.transformDatasetPool<
    DatasetPool.Types.ObjectDetection.Sample,
    DatasetPool.Types.ObjectDetection.DatasetMeta,
    TransedSample,
    ImageDatasetMeta
  >({
    transform: async (sample: DatasetPool.Types.ObjectDetection.Sample): Promise<TransedSample> => {
      if (!sample.data.uri && !sample.data.buffer) {
        throw new TypeError('sample data is empty');
      }
      const originImage = await DataCook.Image.read(sample.data.uri as string || sample.data.buffer as ArrayBuffer);
      const originWidth = originImage.width;
      const originHeight = originImage.height;
      const ratioX = parsedX / originWidth;
      const ratioY = parsedY / originHeight;
      const resized = originImage.resize(parsedX, parsedY);
      const labels = sample.label;
      if (labels) {
        for (const curLabel of labels) {
          curLabel.bbox = [
            curLabel.bbox[0] * ratioX,
            curLabel.bbox[1] * ratioY,
            curLabel.bbox[2] * ratioX,
            curLabel.bbox[3] * ratioY
          ];
        }
      }

      return {
        data: {
          tensor: resized.toTensor(),
          originSize: {
            width: originWidth,
            height: originHeight
          }
        },
        label: labels
      };
    },
    metadata: async (meta) => {
      return {
        ...meta,
        type: DataCook.Dataset.Types.DatasetType.Image,
        dimension: {
          x: parsedX,
          y: parsedY,
          z: 3
        }
      };
    }
  }, dataset);
}

/**
 * this is the data process plugin to process pasvoc format data. It supports resize the image and normalize the image
 * @param resize =[256, 256][optional] resize all images to same size
 * @param normalize =false[optional] if normalize all images to have values between [0, 1]
 */
export default resizeEntry;
