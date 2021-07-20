/**
 * @file This plugin is to access classification image data from different sources. Make sure that
 * the data is conform to expectation.
 */

 import { DatasourceEntry, ScriptContext } from '@pipcook/core';
 import * as Datacook from '@pipcook/datacook';

function transformRecord(record: any, schemas: Datacook.Dataset.Types.TableSchema, data: string[], label: string) {
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

class DataAccessorImpl<T extends Datacook.Dataset.Types.Sample> implements Datacook.Dataset.Types.DataAccessor<T> {
  reader: any;
  boa: any;
  schema: Datacook.Dataset.Types.TableSchema;
  table: string;
  client: any;
  data: string[];
  label: string;

  constructor(table: string, client: any, boa: any, schema: Datacook.Dataset.Types.TableSchema, data: string[], label: string) {
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

class DatasetImpl<T extends Datacook.Dataset.Types.Sample, D extends Datacook.Dataset.Types.TableDatasetMeta> implements Datacook.Dataset.Types.Dataset<T, D>{
  dataKeys: string[] = [];
  schema: Datacook.Dataset.Types.TableSchema = [];
  train: DataAccessorImpl<T>;
  test: DataAccessorImpl<T>;
  
  constructor(data: string[], schema: Datacook.Dataset.Types.TableSchema, train: DataAccessorImpl<T>) {
    this.dataKeys = data;
    this.schema = schema;
    this.train = train;
    this.test = train;
  }

  //@ts-ignore
  async getDatasetMeta() {
    return {
      dataKeys: this.dataKeys,
      tableSchema: this.schema,
      type: Datacook.Dataset.Types.DatasetType.Table,
      size: {
        train: -1,
        test: -1
      },
      labelMap: {}
    }
  }

  shuffle() {
    console.log('shuffle is not implemented in table reader');
  }
}

const OdpsDataCollect: DatasourceEntry<Datacook.Dataset.Types.Sample, Datacook.Dataset.Types.TableDatasetMeta> = async (options: Record<string, any>, context: ScriptContext) => {
  let {
    accessId,
    accessKey,
    project,
    table,
    endpoint = 'http://service-corp.odps.aliyun-inc.com/api',
    data,
    label
  } = options;

  data = data.split(',');

  const { boa } = context;
  const ODPS = boa.import('odps').ODPS;
  const { len } = boa.builtins();

  const client = ODPS(accessId, accessKey, project, endpoint);
  const tableClient = client.get_table(table);

  // get table schema
  const schema: Datacook.Dataset.Types.TableSchema = [];

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
  return new DatasetImpl(data, schema, new DataAccessorImpl(table, client, boa, schema, data, label));
};
 
export default OdpsDataCollect;
