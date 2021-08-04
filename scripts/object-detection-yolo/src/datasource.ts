/**
 * @file This plugin is to access classification image data from different sources. Make sure that
 * the data is conform to expectation.
 */

 import { DataCook, DatasourceEntry, ScriptContext, DatasetPool } from '@pipcook/core';
 // @ts-ignore
 import download from 'pipcook-downloader';
 import * as fs from 'fs-extra';
 import path from 'path';
 import glob from 'glob-promise';
 import * as assert from 'assert';

function process(data: DataCook.Dataset.Types.Coco.Meta, curPath: string) {
  data?.images.forEach(image => {
    if (image.url && (!path.isAbsolute(image.url)) && (!image.url.startsWith('http'))) {
      image.url = path.join(curPath, image.url);
    }
  });
}

const objectDetectionDataSource: DatasourceEntry<
  DataCook.Dataset.Types.Sample,
  DatasetPool.Types.ObjectDetectionDatasetMeta
> = async (options: Record<string, any>, context: ScriptContext) => {
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
     await fs.copy(targetPath, dataDir);
   } else {
     assert.ok(extention[extention.length - 1] === 'zip', 'The dataset provided should be a zip file');
     console.log('downloading dataset ...');
     await download(url, dataDir, {
       extract: true
     });
     isDownload = true;
   }
 
   console.log('unzip and collecting data...');
   let annotationPath: string[] = await glob(path.join(dataDir, '**', '+(train|validation|test)', 'annotation.json'));

 
   let train: DataCook.Dataset.Types.Coco.Meta | undefined = undefined;
   let test: DataCook.Dataset.Types.Coco.Meta | undefined = undefined;
   let valid: DataCook.Dataset.Types.Coco.Meta | undefined = undefined;
   let trainAnnotationPath: string = '';
   let testAnnotationPath: string = '';
   let validAnnotationPath: string = '';
 
   for (const annoationPath of annotationPath) {
     const splitString = annoationPath.split(path.sep);
     const trainType = splitString[splitString.length - 2];
     if (trainType === 'train') {
       train = await fs.readJSON(annoationPath);
       trainAnnotationPath = path.join(annoationPath, '..');
     } else if (trainType === 'test') {
      test = await fs.readJSON(annoationPath);
      testAnnotationPath = path.join(annoationPath, '..');
     } else if (trainType === 'validation') {
      valid = await fs.readJSON(annoationPath);
      validAnnotationPath = path.join(annoationPath, '..');
     }
   }

   train && process(train, trainAnnotationPath);
   test && process(test, testAnnotationPath);
   valid && process(valid, validAnnotationPath);
  
   return await DatasetPool.makeObjectDetectionDatasetFromCoco({
    trainAnnotationObj: train as DataCook.Dataset.Types.Coco.Meta,
    testAnnotationObj: test as DataCook.Dataset.Types.Coco.Meta,
    validAnnotationObj: valid as DataCook.Dataset.Types.Coco.Meta,
   });
};
 
export default objectDetectionDataSource;
 