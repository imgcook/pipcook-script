/**
 * @file This plugin is to access classification image data from different sources. Make sure that
 * the data is conform to expectation.
 */

import { DataCook, DatasourceEntry, DatasetPool } from '@pipcook/core';
// @ts-ignore
import download from 'pipcook-downloader';
import * as fs from 'fs-extra';
import path from 'path';
import glob from 'glob-promise';
import * as assert from 'assert';
import * as XMLParser from 'fast-xml-parser';

function processCoco(data: DataCook.Dataset.Types.Coco.Meta, curPath: string) {
  data?.images.forEach(image => {
    if (image.url && (!path.isAbsolute(image.url)) && (!image.url.startsWith('http'))) {
      image.url = path.join(curPath, image.url);
    }
  });
}

function processPascalVoc(data: DataCook.Dataset.Types.PascalVoc.Annotation[], imageFiles: string[], datasetPath: string) {
  data.forEach(ann => {
    const imgPath = path.join(datasetPath, ann.annotation.path || path.join(ann.annotation.folder, ann.annotation.filename));
    if (imageFiles.indexOf(imgPath) < 0) {
      throw new TypeError(`image ${ann.annotation.filename || ann.annotation.path} is not found.`);
    }
    ann.annotation.path = imgPath;
  });
}

const objectDetectionDataSourceFromCoco: DatasourceEntry<
  DataCook.Dataset.Types.Sample,
  DatasetPool.Types.ObjectDetectionDatasetMeta
> = async (options, context) => {
  const {
    url = ''
  } = options;

  const { workspace } = context;

  const { dataDir } = workspace;

  await fs.ensureDir(dataDir);

  assert.ok(url, 'Please specify the url of your dataset');

  let targetPath: string;
  if (/^file:\/\/.*/.test(url)) {
    targetPath = url.substring(7);
    await fs.copy(targetPath, dataDir);
  } else {
    const fileName = url.split(path.sep)[url.split(path.sep).length - 1];
    const extention = fileName.split('.');
    const supports = ['zip', 'gz', 'bz2'];
    assert.ok(supports.indexOf(extention[extention.length - 1]) !== -1, `The dataset provided should be a ${supports.join(',')} file`);

    console.log('downloading dataset ...');
    await download(url, dataDir, {
      extract: true
    });
  }

  console.log('unzip and collecting data...');
  let annotationPaths: string[] = await glob(path.join(dataDir, '**', '+(train|validation|test)', 'annotation.json'));

  let train: DataCook.Dataset.Types.Coco.Meta | undefined = undefined;
  let test: DataCook.Dataset.Types.Coco.Meta | undefined = undefined;
  let valid: DataCook.Dataset.Types.Coco.Meta | undefined = undefined;
  let trainAnnotationPath: string = '';
  let testAnnotationPath: string = '';
  let validAnnotationPath: string = '';

  for (const annotationPath of annotationPaths) {
    const trainType = path.basename(path.dirname(annotationPath));
    if (trainType === 'train') {
      train = await fs.readJSON(annotationPath);
      trainAnnotationPath = path.join(annotationPath, '..');
    } else if (trainType === 'test') {
     test = await fs.readJSON(annotationPath);
     testAnnotationPath = path.join(annotationPath, '..');
    } else if (trainType === 'validation') {
     valid = await fs.readJSON(annotationPath);
     validAnnotationPath = path.join(annotationPath, '..');
    }
  }
  train && processCoco(train, trainAnnotationPath);
  test && processCoco(test, testAnnotationPath);
  valid && processCoco(valid, validAnnotationPath);

  return await DatasetPool.makeObjectDetectionDatasetFromCoco({
   trainAnnotationObj: train as DataCook.Dataset.Types.Coco.Meta,
   testAnnotationObj: test as DataCook.Dataset.Types.Coco.Meta,
   validAnnotationObj: valid as DataCook.Dataset.Types.Coco.Meta,
  });
};

const objectDetectionDataSourceFromPascalVoc: DatasourceEntry<
  DataCook.Dataset.Types.Sample,
  DatasetPool.Types.ObjectDetectionDatasetMeta
> = async (options, context) => {
  const {
    url = ''
  } = options;

  const { workspace } = context;

  const { dataDir } = workspace;

  await fs.ensureDir(dataDir);

  assert.ok(url, 'Please specify the url of your dataset');

  let targetPath: string;
  if (/^file:\/\/.*/.test(url)) {
    targetPath = url.substring(7);
    await fs.copy(targetPath, dataDir);
  } else {
    const fileName = url.split(path.sep)[url.split(path.sep).length - 1];
    const extention = fileName.split('.');
    assert.ok(extention[extention.length - 1] === 'zip', 'The dataset provided should be a zip file');
    console.log('downloading dataset ...');
    await download(url, dataDir, {
      extract: true
    });
  }

  console.log('unzip and collecting data...');
  let annotationPaths: string[] = await glob(path.join(dataDir, '**', '+(train|validation|test)', '*.xml'));
  let imageFiles: string[] = await glob(path.join(dataDir, '**', '*.+(jpg|jpeg|png)'));
  let train: DataCook.Dataset.Types.PascalVoc.Annotation[] = [];
  let test: DataCook.Dataset.Types.PascalVoc.Annotation[] = [];
  let valid: DataCook.Dataset.Types.PascalVoc.Annotation[] = [];

  for (const annotationPath of annotationPaths) {
    const splitString = annotationPath.split(path.sep);
    const trainType = splitString[splitString.length - 2];
    if (trainType === 'train') {
      train.push(XMLParser.parse((await fs.readFile(annotationPath)).toString()));
    } else if (trainType === 'test') {
      test.push(XMLParser.parse((await fs.readFile(annotationPath)).toString()));
    } else if (trainType === 'validation') {
     valid.push(XMLParser.parse((await fs.readFile(annotationPath)).toString()));
   }
  }
  train.length > 0 && processPascalVoc(train, imageFiles, dataDir);
  test.length > 0 && processPascalVoc(test, imageFiles, dataDir);
  valid.length > 0 && processPascalVoc(valid, imageFiles, dataDir);
  return DatasetPool.makeObjectDetectionDatasetFromPascalVoc({
   trainAnnotationList: train.length > 0 ? train : undefined,
   testAnnotationList: test.length > 0 ? test : undefined,
   validAnnotationList: valid.length > 0 ? valid : undefined,
  });
};

const objectDetectionDataSource: DatasourceEntry<
  DataCook.Dataset.Types.Sample,
  DatasetPool.Types.ObjectDetectionDatasetMeta
> = async (options, context) => {
  const { format = 'coco' } = options;
  return format === 'pascalvoc' ? objectDetectionDataSourceFromPascalVoc(options, context) : objectDetectionDataSourceFromCoco(options, context);
}

export default objectDetectionDataSource;
