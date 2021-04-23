/**
 * @file For plugin to collect test classification data
 */
import * as path from 'path';
import * as fs from 'fs-extra';
import glob from 'glob-promise';
import parse from 'csv-parse/lib/sync';
import { DataSourceApi, DataSourceEntry, DataSourceType, downloadAndExtractTo, Sample, ScriptContext, TableDataSourceMeta } from '@pipcook/pipcook-core';

const readCsvFile = (url: string): Promise<any[]> => {
  const records = parse(fs.readFileSync(url), {
    columns: true,
    skip_empty_lines: true,
    skip_lines_with_error: true
  });
  return records;
};

export enum TableColumnType {
  Number,
  String,
  Bool,
  Map,
  Datetime,
  Unknown
}

/**
 * collect csv data
 */
const textClassDataCollect: DataSourceEntry<string> = async (option: Record<string, any>, context: ScriptContext): Promise<DataSourceApi<string>> => {
  const {
    url = ''
  } = option;
  const { dataDir } = context.workspace;
  await fs.remove(dataDir);
  await fs.ensureDir(dataDir);

  await downloadAndExtractTo(url, dataDir);
  const csvPaths = await glob(path.join(dataDir, '**', '+(train|validation|test)', '*.csv'));
  const trainData: any[] = [];
  const validationData: any[] = [];
  const testData: Sample[] = [];
  for (let i = 0; i < csvPaths.length; i++) {
    const csvPath = csvPaths[i];
    const splitString = csvPath.split(path.sep);
    const trainType = splitString[splitString.length - 2];
    const result = await readCsvFile(csvPath);
    const samples = result.map(item => {
      return {
        label: item['output'],
        data: item['﻿input']
      };
    });
    if (trainType === 'train') {
      trainData.push(...samples);
    }
    if (trainType === 'validation') {
      validationData.push(...samples);
    }
    if (trainType === 'test') {
      testData.push(...samples);
    }
  }
  let indexTrain = 0;
  let indexTest = 0;
  return {
    getDataSourceMeta: async () => {
      return {
        type: DataSourceType.Table,
        size: {
          train: trainData.length,
          test: testData.length
        },
        tableSchema: [
          { name: 'input', type: TableColumnType.String },
          { name: 'output', type: TableColumnType.String }
        ],
        dataKeys: [ 'input' ],
        labelMap: new Map()
      }
    },
    test: {
      next: async (): Promise<any> => {
        return testData[indexTest++];
      },
      nextBatch: async (batchSize: number): Promise<Array<any> | null> => {
        let result = [];
        for (let i = 0; i < batchSize; i++) {
          const s = testData[indexTest++];
          if (s) {
            result.push(s);
          } else {
            break;
          }
        }
        return result;
      },
      seek: async (pos: number): Promise<void> => {
        indexTest = pos;
      }
    },
    train: {
      next: async (): Promise<any> => {
        return trainData[indexTrain++];
      },
      nextBatch: async (batchSize: number): Promise<Array<any> | null> => {
        let result = [];
        for (let i = 0; i < batchSize; i++) {
          const s = testData[indexTrain++];
          if (s) {
            result.push(s);
          } else {
            break;
          }
        }
        return result;
      },
      seek: async (pos: number): Promise<void> => {
        indexTrain = pos;
      }
    }
  };
};

export default textClassDataCollect;
