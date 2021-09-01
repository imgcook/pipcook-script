/**
 * @file For plugin to collect test classification data
 */
import * as path from 'path';
import * as fs from 'fs-extra';
import glob from 'glob-promise';
// @ts-ignore
import download from 'pipcook-downloader';
import { ScriptContext, DatasourceEntry, DatasetPool, DataCook } from '@pipcook/core';

type Sample = DataCook.Dataset.Types.Sample<string, string>;
type ScriptDatasetPool = DatasetPool.Types.DatasetPool<Sample, DatasetPool.Types.ClassificationDatasetMeta>;
type Entry = DatasourceEntry<Sample, DatasetPool.Types.ClassificationDatasetMeta>;

/**
 * collect csv data
 */
const textClassDataCollect: Entry = async (option: Record<string, any>, context: ScriptContext): Promise<ScriptDatasetPool> => {
  const {
    url = ''
  } = option;
  const { dataDir } = context.workspace;
  await fs.remove(dataDir);
  await fs.ensureDir(dataDir);

  await download(url, dataDir, {
    extract: true
  });
  const csvPaths = await glob(path.join(dataDir, '**', '+(train|validation|test)', '*.csv'));
  let trainData: string;
  let testData: string;
  let validData: string;
  for (let i = 0; i < csvPaths.length; i++) {
    const csvPath = csvPaths[i];
    const trainType = path.basename(path.dirname(csvPath));
    if (trainType === 'train') {
      trainData = (await fs.readFile(csvPath)).toString();
    }
    if (trainType === 'validation') {
      validData = (await fs.readFile(csvPath)).toString();
    }
    if (trainType === 'test') {
      testData = (await fs.readFile(csvPath)).toString();
    }
  }
  const datasetPool = await DatasetPool.Csv.makeDatasetPoolFromCsv({
    trainData,
    testData,
    validData,
    hasHeader: true,
    labels: [ 'output' ]
  });
  const categories = (await datasetPool.train?.nextBatch(-1))?.map((sample) => sample.label['output']);
  await datasetPool.train?.seek(0);
  return datasetPool.transform({
    transform: async (sample: DataCook.Dataset.Types.Csv.Sample): Promise<Sample> => {
      return {
        data: sample.data['﻿input'],
        label: sample.label['output']
      };
    },
    metadata: async (meta?: DatasetPool.Types.Csv.DatasetMeta): Promise<DatasetPool.Types.ClassificationDatasetMeta> => {
      return {
        ...meta,
        categories
      };
    }
  });
};

export default textClassDataCollect;
