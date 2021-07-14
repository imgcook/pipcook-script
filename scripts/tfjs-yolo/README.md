## 初始化
```javascript
import ODPS from '@ali/alias-odps'

const o = new ODPS({
  accessId: '',
  accessSecret: '',
  project: '',
  endpoint: 'http://service-corp.odps.aliyun-inc.com/api'
})
```


### 获取所有项目
```javascript
const projects = await o.listProjects();
```

### 获取项目下所有 table
```javascript
const tables = await o.listTables()
```


### 获取某个 table 详细信息
```javascript
const table = await o.getTable('table_name');
```




### 运行 xflow
```javascript
 const instanceId = await o.runXflow('xflow_name', {
    // 运行参数
 });
```


### 获取 xflow 运行任务的状态
```javascript
const status = await o.getXflowStatus(instanceId)
```


### 获取 xflow 运行日志
```javascript
const logviewAddess = await o.getXflowLogView(instanceId);
```
