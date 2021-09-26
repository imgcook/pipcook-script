/**
 * @file For plugin to collect test classification data
 */
const path = require('path');
const fs = require('fs-extra');
const glob = require('glob-promise');
const download = require('pipcook-downloader');
const { DatasetPool } = require('@pipcook/core');

/**
 * collect csv data
 */
const textClassDataCollect = async (option, context) => {
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
  let trainData;
  let testData;
  let validData;
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
  const categories = (await datasetPool.train.nextBatch(-1)).map((sample) => sample.label['output']);
  await datasetPool.train.seek(0);
  return datasetPool.transform({
    transform: async (sample) => ({ data: sample.data['﻿input'], label: sample.label['output'] }),
    metadata: async (meta) => ({ ...meta, categories })
  });
};

module.exports = textClassDataCollect;
