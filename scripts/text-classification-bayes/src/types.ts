import { DatasourceEntry, DatasetPool } from '@pipcook/core';
import * as DataCook from '@pipcook/datacook';

export type Sample = DataCook.Dataset.Types.Sample<string, string>;
export type ScriptDatasetPool = DatasetPool.Types.DatasetPool<Sample, DatasetPool.Types.ClassificationDatasetMeta>;
export type Entry = DatasourceEntry<DataCook.Dataset.Types.Sample<string, string>, DatasetPool.Types.ClassificationDatasetMeta>;
