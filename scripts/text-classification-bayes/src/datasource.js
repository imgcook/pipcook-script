/**
 * @file For plugin to collect test classification data
 */
const path = require('path');
const fs = require('fs-extra');
const glob = require('glob-promise');
const download = require('pipcook-downloader');
const decompress = require('decompress');
const assert = require('assert');
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

  assert.ok(url, 'Please specify the url of your dataset');

  const fileName = url.split(path.sep)[url.split(path.sep).length - 1];
  const extention = fileName.split('.');

  let targetPath;
  if (/^file:\/\/.*/.test(url)) {
    targetPath = url.substring(7);
    let decompressPath = targetPath;
    if (extention[extention.length - 1] === 'zip') {
      decompressPath = targetPath.split('.zip')[0];
      await decompress(targetPath, decompressPath);
    }
    await fs.remove(dataDir);
    await fs.symlink(decompressPath, dataDir);
  } else {
    assert.ok(extention[extention.length - 1] === 'zip', 'The dataset provided should be a zip file');
    console.log('downloading dataset ...');
    await download(url, dataDir, {
      extract: true
    });
  }

  console.log('unzip and collecting data...');
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
    transform: async (sample) => {
      if (!sample.data || sample.data['input'] || !sample.label || sample.label['output']) {
        throw new TypeError(`invalid sample: ${JSON.stringify(sample)}`);
      }
      return { data: sample.data['input'], label: sample.label['output'] };
    },
    metadata: async (meta) => ({ ...meta, categories })
  });
};

module.exports = textClassDataCollect;
