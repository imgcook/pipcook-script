/**
 * @file This plugin is to access classification image data from different sources. Make sure that
 * the data is conform to expectation.
 */
import { DataCook, DatasourceEntry, ScriptContext, DatasetPool } from '@pipcook/core';
import * as boa from '@pipcook/boa';

function transformRecord(record: any, schemas: DataCook.Dataset.Types.TableSchema, data: string[], label: string) {
  const obj: any = {
    data: []
  };
  for (const schema of schemas) {
    if (data.includes(schema.name)) {
      obj.data.push(parseFloat(record[schema.name] || '0'))
    } else if (label === schema.name) {
      obj.label = record[schema.name];
    }
  }
  return obj;
}

class DataAccessorImpl<T extends DataCook.Dataset.Types.Sample> implements DataCook.Dataset.Types.Dataset<T> {
  reader: any;
  boa: any;
  schema: DataCook.Dataset.Types.TableSchema;
  table: string;
  client: any;
  data: string[];
  label: string;

  constructor(table: string, client: any, boa: any, schema: DataCook.Dataset.Types.TableSchema, data: string[], label: string) {
    const reader = client.read_table(table);
    this.table = table;
    this.client = client;
    this.reader = reader;
    this.boa = boa;
    this.schema = schema;
    this.data = data;
    this.label = label;
  }

  shuffle(): void {
  }

  async next(): Promise<T | null> {
    const { next } = this.boa.builtins();
    const record = next(this.reader, null);
    return record && transformRecord(record, this.schema, this.data, this.label);
  }

  async nextBatch(batchSize: number): Promise<Array<T>> {
    const ret: Array<T> = [];

    // return zero-length array if 0 present
    if (batchSize === 0) {
      return ret;
    }

    // return the rest of dataset if -1 present
    if (batchSize === -1) {
      let value = await this.next();
      while (value) {
        ret.push(value);
        value = await this.next();
      }
      return ret;
    }

    if (batchSize < -1) {
      throw new RangeError(`Batch size should be larger than -1 but ${batchSize} is present`);
    }

    // default behaviour
    while (batchSize--) {
      const value = await this.next();
      if (!value) break;
      ret.push(value);
    }
    return ret;
  }

  async seek(offset: number): Promise<void> {
    if (offset === 0) {
      const reader = this.client.read_table(this.table);
      this.reader = reader;
    }
  }
}

const OdpsDataCollect: DatasourceEntry<DataCook.Dataset.Types.Sample, DatasetPool.Types.TableDatasetMeta> = async (options: Record<string, any>, context: ScriptContext) => {
  let {
    project,
    table,
    endpoint,
    data,
    label
  } = options;

  const {
    odpssource_accessId,
    odpssource_accessKey
  } = process.env;

  data = data.split(',');

  const ODPS = boa.import('odps').ODPS;
  const { len } = boa.builtins();

  const client = ODPS(odpssource_accessId, odpssource_accessKey, project, endpoint);
  const tableClient = client.get_table(table);

  // get table schema
  const schema: DataCook.Dataset.Types.TableSchema = [];

  const columns = tableClient.schema.columns;
  for (let i = 0; i < len(columns); i++) {
    const column = columns[i];
    schema.push({
      name: column.name,
      type: column.type
    })
  }
  if (data[0] === '*') {
    data = schema.map(ele => ele.name).filter(ele => ele !== label);
  }
  const train = new DataAccessorImpl(table, client, boa, schema, data, label);
  const test = train;
  return DatasetPool.ArrayDatasetPoolImpl.from({
    train,
    test
  }, {
    dataKeys: data,
    tableSchema: schema,
    type: DataCook.Dataset.Types.DatasetType.Table,
    size: {
      train: 0,
      test: 0,
      valid: 0,
      predicted: 0
    }
  });
};
 
export default OdpsDataCollect;
