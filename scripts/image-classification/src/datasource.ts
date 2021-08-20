/**
 * @file This plugin is to access classification image data from different sources. Make sure that
 * the data is conform to expectation.
 */

import { DatasourceEntry, DataCook, DatasetPool } from '@pipcook/core';
// @ts-ignore
import download from 'pipcook-downloader';
import * as fs from 'fs-extra';
import path from 'path';
import glob from 'glob-promise';
import * as assert from 'assert';
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
const imageClassDataCollect: DatasourceEntry<DataCook.Dataset.Types.ImageClassification.Sample, DatasetPool.Types.ImageClassification.DatasetMeta>
  = async (options, context) => {
  const {
    url = ''
  } = options;

  const { workspace } = context;

  const { dataDir } = workspace;

  await fs.ensureDir(dataDir);

  let isDownload = false;

  assert.ok(url, 'Please specify the url of your dataset');

  const fileName = url.split(path.sep)[url.split(path.sep).length - 1];
  const extention = fileName.split('.');

  let targetPath: string;
  if (/^file:\/\/.*/.test(url)) {
    targetPath = url.substring(7);
    await fs.remove(dataDir);
    await fs.symlink(targetPath, dataDir);
  } else {
    assert.ok(extention[extention.length - 1] === 'zip', 'The dataset provided should be a zip file');
    console.log('downloading dataset ...');
    await download(url, dataDir, {
      extract: true
    });
    isDownload = true;
  }

  console.log('unzip and collecting data...');
  let imagePaths = await glob(path.join(dataDir, '**', '+(train|validation|test)', '*', '*.+(jpg|jpeg|png)'));

  const train: DataCook.Dataset.Types.ImageClassification.ImageDesc[] = [];
  const test: DataCook.Dataset.Types.ImageClassification.ImageDesc[] = [];
  const valid: DataCook.Dataset.Types.ImageClassification.ImageDesc[] = [];

  for (const imagePath of imagePaths) {
    const trainType = path.basename(path.dirname(path.dirname(imagePath)));
    const category = path.basename(path.dirname(imagePath));

    if (trainType === 'train') {
      train.push({
        category,
        uri: imagePath
      });
    } else if (trainType === 'test') {
      test.push({
        category,
        uri: imagePath
      });
    } else if (trainType === 'validation') {
      valid.push({
        category,
        uri: imagePath
      });
    }
  }
  return DatasetPool.makeImageClassificationDatasetFromList({
    train,
    test,
    valid: valid.length > 0 ? valid : undefined
  });
};

export default imageClassDataCollect;
