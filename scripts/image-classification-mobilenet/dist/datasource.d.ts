/**
 * @file This plugin is to access classification image data from different sources. Make sure that
 * the data is conform to expectation.
 */
import { DatasourceEntry } from '@pipcook/core';
import type * as Datacook from '@pipcook/datacook';
/**
 * collect the data either from remote url or local file system. It expects a zip
 * which contains the structure of traditional image classification data folder.
 *
 * The structure should be:
 * - train
 *  - category1-name
 *    - image1.jpg
 *    - image2.jpe
 *    - ...
 *  - category2-name
 *  - ...
 * - test (optional)
 * - validate (optional)
 *
 * @param url path of the data, if it comes from local file, please add file:// as prefix
 */
declare const imageClassDataCollect: DatasourceEntry<Datacook.Dataset.Types.Sample, Datacook.Dataset.Types.ImageDatasetMeta>;
export default imageClassDataCollect;
