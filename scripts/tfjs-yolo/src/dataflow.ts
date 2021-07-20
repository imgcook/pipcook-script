import { DataflowEntry, ScriptContext } from '@pipcook/core';
import type * as Datacook from '@pipcook/datacook';

//@ts-ignore
const resizeEntry: DataflowEntry<Datacook.Dataset.Types.Sample, Datacook.Dataset.Types.ImageDatasetMeta> =
  async (dataset: Datacook.Dataset.Types.Dataset<Datacook.Dataset.Types.Sample, any>, options: Record<string, any>, context: ScriptContext)  => {
  const [ x = '-1', y = '-1' ] = options['size'];

  const parsedX = parseInt(x);
  const parsedY = parseInt(y);
  if (parsedX == -1 || parsedY == -1) return;
  const datasets = await context.dataCook.Dataset.transformDataset<Datacook.Dataset.Types.ImageDatasetMeta, Datacook.Dataset.Types.Sample>({
    next: async (sample) => {
      const originImage = await context.dataCook.Image.read(sample.data.url as string);
      const originWidth = originImage.width;
      const originHeight = originImage.height;
      const ratioX = parsedX / originWidth;
      const ratioY = parsedY / originHeight;
      const resized = originImage.resize(parsedX, parsedY);
      for (const curLabel of sample.label) {
        curLabel.bbox = [
          curLabel.bbox[0] * ratioX,
          curLabel.bbox[1] * ratioY,
          curLabel.bbox[2] * ratioX,
          curLabel.bbox[3] * ratioY
        ]
      }
      return {
        data: resized.toTensor(),
        label: sample.label,
      }
    },
    metadata: async (meta) => {
      return {
        ...meta,
        dimension: {
          x: parsedX,
          y: parsedY,
          z: 3
        }
      };
    }
  }, dataset);

  return datasets;
}

/**
 * this is the data process plugin to process pasvoc format data. It supports resize the image and normalize the image
 * @param resize =[256, 256][optional] resize all images to same size
 * @param normalize =false[optional] if normalize all images to have values between [0, 1]
 */
export default resizeEntry;
