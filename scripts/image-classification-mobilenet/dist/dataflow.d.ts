import { DataflowEntry } from '@pipcook/core';
import type * as Datacook from '@pipcook/datacook';
declare const resizeEntry: DataflowEntry<Datacook.Dataset.Types.Sample, Datacook.Dataset.Types.ImageDatasetMeta>;
/**
 * this is the data process plugin to process pasvoc format data. It supports resize the image and normalize the image
 * @param resize =[256, 256][optional] resize all images to same size
 * @param normalize =false[optional] if normalize all images to have values between [0, 1]
 */
export default resizeEntry;
