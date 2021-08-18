/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(global, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/datasource.ts":
/*!***************************!*\
  !*** ./src/datasource.ts ***!
  \***************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });\n}) : (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    o[k2] = m[k];\n}));\nvar __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {\n    Object.defineProperty(o, \"default\", { enumerable: true, value: v });\n}) : function(o, v) {\n    o[\"default\"] = v;\n});\nvar __importStar = (this && this.__importStar) || function (mod) {\n    if (mod && mod.__esModule) return mod;\n    var result = {};\n    if (mod != null) for (var k in mod) if (k !== \"default\" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);\n    __setModuleDefault(result, mod);\n    return result;\n};\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nvar __generator = (this && this.__generator) || function (thisArg, body) {\n    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;\n    return g = { next: verb(0), \"throw\": verb(1), \"return\": verb(2) }, typeof Symbol === \"function\" && (g[Symbol.iterator] = function() { return this; }), g;\n    function verb(n) { return function (v) { return step([n, v]); }; }\n    function step(op) {\n        if (f) throw new TypeError(\"Generator is already executing.\");\n        while (_) try {\n            if (f = 1, y && (t = op[0] & 2 ? y[\"return\"] : op[0] ? y[\"throw\"] || ((t = y[\"return\"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;\n            if (y = 0, t) op = [op[0] & 2, t.value];\n            switch (op[0]) {\n                case 0: case 1: t = op; break;\n                case 4: _.label++; return { value: op[1], done: false };\n                case 5: _.label++; y = op[1]; op = [0]; continue;\n                case 7: op = _.ops.pop(); _.trys.pop(); continue;\n                default:\n                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }\n                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }\n                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }\n                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }\n                    if (t[2]) _.ops.pop();\n                    _.trys.pop(); continue;\n            }\n            op = body.call(thisArg, _);\n        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }\n        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };\n    }\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\n/**\n * @file This plugin is to access classification image data from different sources. Make sure that\n * the data is conform to expectation.\n */\nvar core_1 = __webpack_require__(/*! @pipcook/core */ \"@pipcook/core\");\nvar path = __importStar(__webpack_require__(/*! path */ \"path\"));\nvar boa = __webpack_require__(/*! @pipcook/boa */ \"@pipcook/boa\");\nvar len = boa.builtins().len;\nvar sys = boa.import('sys');\nfunction transformRecord(record, schemas, data, label) {\n    var obj = {\n        data: []\n    };\n    for (var _i = 0, schemas_1 = schemas; _i < schemas_1.length; _i++) {\n        var schema = schemas_1[_i];\n        if (data.includes(schema.name)) {\n            obj.data.push(parseFloat(record[schema.name] || '0'));\n        }\n        else if (label === schema.name) {\n            obj.label = parseFloat(record[schema.name]);\n        }\n    }\n    return obj;\n}\nvar DataAccessorImpl = /** @class */ (function () {\n    function DataAccessorImpl(table, client, schema, data, label, pt) {\n        var reader;\n        if (pt) {\n            reader = client.read_table(table, boa.kwargs({\n                partition: pt\n            }));\n        }\n        else {\n            reader = client.read_table(table);\n        }\n        this.table = table;\n        this.client = client;\n        this.reader = reader;\n        this.schema = schema;\n        this.data = data;\n        this.label = label;\n        this.pt = pt;\n    }\n    DataAccessorImpl.prototype.shuffle = function () {\n    };\n    DataAccessorImpl.prototype.next = function () {\n        return __awaiter(this, void 0, void 0, function () {\n            var next, record;\n            return __generator(this, function (_a) {\n                next = boa.builtins().next;\n                record = next(this.reader, null);\n                return [2 /*return*/, record && transformRecord(record, this.schema, this.data, this.label)];\n            });\n        });\n    };\n    DataAccessorImpl.prototype.nextBatch = function (batchSize) {\n        return __awaiter(this, void 0, void 0, function () {\n            var ret, value, value;\n            return __generator(this, function (_a) {\n                switch (_a.label) {\n                    case 0:\n                        ret = [];\n                        // return zero-length array if 0 present\n                        if (batchSize === 0) {\n                            return [2 /*return*/, ret];\n                        }\n                        if (!(batchSize === -1)) return [3 /*break*/, 5];\n                        return [4 /*yield*/, this.next()];\n                    case 1:\n                        value = _a.sent();\n                        _a.label = 2;\n                    case 2:\n                        if (!value) return [3 /*break*/, 4];\n                        ret.push(value);\n                        return [4 /*yield*/, this.next()];\n                    case 3:\n                        value = _a.sent();\n                        return [3 /*break*/, 2];\n                    case 4: return [2 /*return*/, ret];\n                    case 5:\n                        if (batchSize < -1) {\n                            throw new RangeError(\"Batch size should be larger than -1 but \" + batchSize + \" is present\");\n                        }\n                        _a.label = 6;\n                    case 6:\n                        if (!batchSize--) return [3 /*break*/, 8];\n                        return [4 /*yield*/, this.next()];\n                    case 7:\n                        value = _a.sent();\n                        if (!value)\n                            return [3 /*break*/, 8];\n                        ret.push(value);\n                        return [3 /*break*/, 6];\n                    case 8: return [2 /*return*/, ret];\n                }\n            });\n        });\n    };\n    DataAccessorImpl.prototype.seek = function (offset) {\n        return __awaiter(this, void 0, void 0, function () {\n            var reader;\n            return __generator(this, function (_a) {\n                if (offset === 0) {\n                    reader = void 0;\n                    if (this.pt) {\n                        reader = this.client.read_table(this.table, boa.kwargs({\n                            partition: this.pt\n                        }));\n                    }\n                    else {\n                        reader = this.client.read_table(this.table);\n                    }\n                    this.reader = reader;\n                }\n                return [2 /*return*/];\n            });\n        });\n    };\n    return DataAccessorImpl;\n}());\nvar OdpsDataCollect = function (options, context) { return __awaiter(void 0, void 0, void 0, function () {\n    var project, table, endpoint, data, label, pt, ODPS, _a, odpssource_accessId, odpssource_accessKey, client, tableClient, schema, columns, i, column, train, test;\n    return __generator(this, function (_b) {\n        project = options.project, table = options.table, endpoint = options.endpoint, data = options.data, label = options.label, pt = options.pt;\n        sys.path.append(path.join(context.workspace.frameworkDir, 'site-packages'));\n        ODPS = boa.import('odps').ODPS;\n        _a = process.env, odpssource_accessId = _a.odpssource_accessId, odpssource_accessKey = _a.odpssource_accessKey;\n        data = data.split(',');\n        client = ODPS(odpssource_accessId, odpssource_accessKey, project, endpoint);\n        tableClient = client.get_table(table);\n        schema = [];\n        columns = tableClient.schema.columns;\n        for (i = 0; i < len(columns); i++) {\n            column = columns[i];\n            schema.push({\n                name: column.name,\n                type: column.type\n            });\n        }\n        if (data[0] === '*') {\n            data = schema.map(function (ele) { return ele.name; }).filter(function (ele) { return ele !== label; });\n        }\n        train = new DataAccessorImpl(table, client, schema, data, label, pt);\n        test = train;\n        return [2 /*return*/, core_1.DatasetPool.ArrayDatasetPoolImpl.from({\n                train: train,\n                test: test\n            }, {\n                dataKeys: data,\n                tableSchema: schema,\n                type: core_1.DataCook.Dataset.Types.DatasetType.Table,\n                size: {\n                    train: 0,\n                    test: 0,\n                    valid: 0,\n                    predicted: 0\n                }\n            })];\n    });\n}); };\nexports.default = OdpsDataCollect;\n\n\n//# sourceURL=webpack://@pipcook/plugins-smartui-logic-regression/./src/datasource.ts?");

/***/ }),

/***/ "@pipcook/boa":
/*!*******************************!*\
  !*** external "@pipcook/boa" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("@pipcook/boa");

/***/ }),

/***/ "@pipcook/core":
/*!********************************!*\
  !*** external "@pipcook/core" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("@pipcook/core");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/datasource.ts");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});