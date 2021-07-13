/**
 * @file This plugin is to access classification image data from different sources. Make sure that
 * the data is conform to expectation.
 */

import { DatasourceEntry, ScriptContext } from '@pipcook/core';
import type * as Datacook from '@pipcook/datacook';
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
const imageClassDataCollect: DatasourceEntry<Datacook.Dataset.Types.Sample, Datacook.Dataset.Types.ImageDatasetMeta> = async (options: Record<string, any>, context: ScriptContext) => {
  const {
    url = ''
  } = options;

  const { workspace, dataCook } = context;

  const { dataDir } = workspace;

  await fs.ensureDir(dataDir);

  let isDownload = false;

  assert.ok(url, 'Please specify the url of your dataset');

  const fileName = url.split(path.sep)[url.split(path.sep).length - 1];
  const extention = fileName.split('.');

  assert.ok(extention[extention.length - 1] === 'zip', 'The dataset provided should be a zip file');

  let targetPath: string;
  if (/^file:\/\/.*/.test(url)) {
    targetPath = url.substring(7);
  } else {
    console.log('downloading dataset ...');
    await download(url, dataDir, {
      extract: true
    });
    isDownload = true;
  }

  console.log('unzip and collecting data...');
  let imagePaths = await glob(path.join(dataDir, '**', '+(train|validation|test)', '*', '*.+(jpg|jpeg|png)'));

  // TODO utils for making dataset
  const train: any[] = [];
  let trainOffset = 0;
  const test: any[] = [];
  let testOffset = 0;
  const categories: Array<string> = [];

  for (const imagePath of imagePaths) {
    const splitString = imagePath.split(path.sep);
    const trainType = splitString[splitString.length - 3];
    const category = splitString[splitString.length - 2];

    let categoryIndex = categories.findIndex((value) => value === category);
    if (categoryIndex === -1) {
      categoryIndex = categories.length;
      categories.push(category);
    }

    if (trainType === 'train') {
      train.push({ data: imagePath, label: categoryIndex});
    } else if (trainType === 'test') {
      test.push({ data: imagePath, label: categoryIndex});
    }
  }

  const sample = await context.dataCook.Image.read(train[0].data);

  const meta = {
    type: dataCook.Dataset.Types.DatasetType.Image,
    size: {
      train: train.length,
      test: train.length
    },
    dimension: {
      x: sample.width,
      y: sample.height,
      z: sample.channel
    },
    //@ts-ignore
    labelMap: categories
  }

  return dataCook.Dataset.makeDataset({
    trainData: train,
    testData: test
  }, meta);
};

export default imageClassDataCollect;
