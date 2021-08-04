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

/***/ "./src/model.ts":
/*!**********************!*\
  !*** ./src/model.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });\n}) : (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    o[k2] = m[k];\n}));\nvar __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {\n    Object.defineProperty(o, \"default\", { enumerable: true, value: v });\n}) : function(o, v) {\n    o[\"default\"] = v;\n});\nvar __importStar = (this && this.__importStar) || function (mod) {\n    if (mod && mod.__esModule) return mod;\n    var result = {};\n    if (mod != null) for (var k in mod) if (k !== \"default\" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);\n    __setModuleDefault(result, mod);\n    return result;\n};\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nvar __generator = (this && this.__generator) || function (thisArg, body) {\n    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;\n    return g = { next: verb(0), \"throw\": verb(1), \"return\": verb(2) }, typeof Symbol === \"function\" && (g[Symbol.iterator] = function() { return this; }), g;\n    function verb(n) { return function (v) { return step([n, v]); }; }\n    function step(op) {\n        if (f) throw new TypeError(\"Generator is already executing.\");\n        while (_) try {\n            if (f = 1, y && (t = op[0] & 2 ? y[\"return\"] : op[0] ? y[\"throw\"] || ((t = y[\"return\"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;\n            if (y = 0, t) op = [op[0] & 2, t.value];\n            switch (op[0]) {\n                case 0: case 1: t = op; break;\n                case 4: _.label++; return { value: op[1], done: false };\n                case 5: _.label++; y = op[1]; op = [0]; continue;\n                case 7: op = _.ops.pop(); _.trys.pop(); continue;\n                default:\n                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }\n                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }\n                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }\n                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }\n                    if (t[2]) _.ops.pop();\n                    _.trys.pop(); continue;\n            }\n            op = body.call(thisArg, _);\n        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }\n        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };\n    }\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nvar tf = __importStar(__webpack_require__(/*! @tensorflow/tfjs-node */ \"@tensorflow/tfjs-node\"));\nvar defaultWeightsMap = {\n    'resnet': 'https://ai-sample.oss-cn-hangzhou.aliyuncs.com/pipcook/models/resnet50_tfjs/model.json',\n    'mobilenet': 'http://ai-sample.oss-cn-hangzhou.aliyuncs.com/pipcook/models/mobilenet/web_model/model.json'\n};\n/**\n * this is the plugin used to load a mobilenet model or load existing model.\n * @param optimizer (string | tf.train.Optimizer)[optional / default = tf.train.adam()] the optimizer of model\n * @param loss (string | string [] | {[outputName: string]: string} | LossOrMetricFn | LossOrMetricFn [] | {[outputName: string]: LossOrMetricFn}) \\\n * [optional / default = 'categoricalCrossentropy'] the loss function of model\n * @param metrics (string | LossOrMetricFn | Array | {[outputName: string]: string | LossOrMetricFn}): [optional / default = ['accuracy']]\n * @param hiddenLayerUnits (number): [optional / default = 10]\n*/\nfunction constructModel(options, meta) {\n    return __awaiter(this, void 0, void 0, function () {\n        var _a, \n        // @ts-ignore\n        optimizer, _b, loss, _c, metrics, _d, hiddenLayerUnits, _e, modelUrl, _f, freeze, categories, inputShape, NUM_CLASSES, model, localModel, mobilenet, _i, _g, _layer;\n        return __generator(this, function (_h) {\n            switch (_h.label) {\n                case 0:\n                    _a = options.optimizer, optimizer = _a === void 0 ? tf.train.adam() : _a, _b = options.loss, loss = _b === void 0 ? 'categoricalCrossentropy' : _b, _c = options.metrics, metrics = _c === void 0 ? ['accuracy'] : _c, _d = options.hiddenLayerUnits, hiddenLayerUnits = _d === void 0 ? 10 : _d, _e = options.modelUrl, modelUrl = _e === void 0 ? 'mobilenet' : _e, _f = options.freeze, freeze = _f === void 0 ? true : _f;\n                    modelUrl = defaultWeightsMap[modelUrl] || modelUrl;\n                    categories = meta.categories;\n                    inputShape = meta.dimension;\n                    NUM_CLASSES = categories.length;\n                    model = null;\n                    localModel = tf.sequential();\n                    localModel.add(tf.layers.inputLayer({\n                        inputShape: [inputShape.x, inputShape.y, inputShape.z]\n                    }));\n                    // @ts-ignore\n                    console.log('loading model ...');\n                    return [4 /*yield*/, tf.loadLayersModel(modelUrl)];\n                case 1:\n                    mobilenet = _h.sent();\n                    if (freeze) {\n                        for (_i = 0, _g = mobilenet.layers; _i < _g.length; _i++) {\n                            _layer = _g[_i];\n                            _layer.trainable = false;\n                        }\n                    }\n                    localModel.add(mobilenet);\n                    // @ts-ignore\n                    localModel.add(tf.layers.flatten());\n                    // @ts-ignore\n                    localModel.add(tf.layers.dense({\n                        units: hiddenLayerUnits,\n                        activation: 'relu'\n                    }));\n                    // @ts-ignore\n                    localModel.add(tf.layers.dense({\n                        units: NUM_CLASSES,\n                        activation: 'softmax'\n                    }));\n                    // @ts-ignore\n                    model = localModel;\n                    model.compile({\n                        optimizer: optimizer,\n                        loss: loss,\n                        metrics: metrics\n                    });\n                    return [2 /*return*/, model];\n            }\n        });\n    });\n}\n/**\n * this is plugin used to train tfjs model with pascal voc data format for image classification problem.\n * @param data : train data\n * @param model : model loaded before\n * @param epochs : need to specify epochs\n * @param batchSize : need to specify batch size\n * @param optimizer : need to specify optimizer\n */\n// @ts-ignore\nfunction trainModel(options, modelDir, model, dataset) {\n    return __awaiter(this, void 0, void 0, function () {\n        var _a, epochs, _b, batchSize, size, trainSize, batchesPerEpoch, meta, i, _loop_1, j;\n        return __generator(this, function (_c) {\n            switch (_c.label) {\n                case 0:\n                    _a = options.epochs, epochs = _a === void 0 ? 10 : _a, _b = options.batchSize, batchSize = _b === void 0 ? 16 : _b;\n                    return [4 /*yield*/, dataset.shuffle()];\n                case 1:\n                    _c.sent();\n                    return [4 /*yield*/, dataset.getDatasetMeta()];\n                case 2:\n                    size = (_c.sent()).size;\n                    trainSize = size.train;\n                    batchesPerEpoch = Math.floor(trainSize / batchSize);\n                    return [4 /*yield*/, dataset.getDatasetMeta()];\n                case 3:\n                    meta = _c.sent();\n                    i = 0;\n                    _c.label = 4;\n                case 4:\n                    if (!(i < epochs)) return [3 /*break*/, 10];\n                    console.log(\"Epoch \" + i + \"/\" + epochs + \" start\");\n                    return [4 /*yield*/, dataset.train.seek(0)];\n                case 5:\n                    _c.sent();\n                    _loop_1 = function (j) {\n                        var dataBatch, xs, ys, trainRes;\n                        return __generator(this, function (_d) {\n                            switch (_d.label) {\n                                case 0: return [4 /*yield*/, dataset.train.nextBatch(batchSize)];\n                                case 1:\n                                    dataBatch = _d.sent();\n                                    xs = tf.tidy(function () { return tf.stack(dataBatch.map(function (ele) { return ele.data; })); });\n                                    ys = tf.tidy(function () { return tf.stack(dataBatch.map(function (ele) { return tf.oneHot(ele.label, meta.categories.length); })); });\n                                    return [4 /*yield*/, model.trainOnBatch(xs, ys)];\n                                case 2:\n                                    trainRes = _d.sent();\n                                    tf.dispose(xs);\n                                    tf.dispose(ys);\n                                    dataBatch.forEach(function (ele) {\n                                        tf.dispose(ele.data);\n                                    });\n                                    if (j % Math.floor(batchesPerEpoch / 10) === 0) {\n                                        console.log(\"Iteration \" + j + \"/\" + batchesPerEpoch + \" result --- loss: \" + trainRes[0] + \" accuracy: \" + trainRes[1]);\n                                    }\n                                    return [2 /*return*/];\n                            }\n                        });\n                    };\n                    j = 0;\n                    _c.label = 6;\n                case 6:\n                    if (!(j < batchesPerEpoch)) return [3 /*break*/, 9];\n                    return [5 /*yield**/, _loop_1(j)];\n                case 7:\n                    _c.sent();\n                    _c.label = 8;\n                case 8:\n                    j++;\n                    return [3 /*break*/, 6];\n                case 9:\n                    i++;\n                    return [3 /*break*/, 4];\n                case 10: return [4 /*yield*/, model.save(\"file://\" + modelDir)];\n                case 11:\n                    _c.sent();\n                    return [2 /*return*/];\n            }\n        });\n    });\n}\nvar main = function (api, options, context) { return __awaiter(void 0, void 0, void 0, function () {\n    var modelDir, meta, model;\n    return __generator(this, function (_a) {\n        switch (_a.label) {\n            case 0:\n                modelDir = context.workspace.modelDir;\n                return [4 /*yield*/, api.dataset.getDatasetMeta()];\n            case 1:\n                meta = _a.sent();\n                return [4 /*yield*/, constructModel(options, meta)];\n            case 2:\n                model = _a.sent();\n                // @ts-ignore\n                return [4 /*yield*/, trainModel(options, modelDir, model, api.dataset, tf)];\n            case 3:\n                // @ts-ignore\n                _a.sent();\n                return [2 /*return*/];\n        }\n    });\n}); };\nexports.default = main;\n\n\n//# sourceURL=webpack://@pipcook/mobilenet-pipeline/./src/model.ts?");

/***/ }),

/***/ "@tensorflow/tfjs-node":
/*!****************************************!*\
  !*** external "@tensorflow/tfjs-node" ***!
  \****************************************/
/***/ ((module) => {

module.exports = require("@tensorflow/tfjs-node");;

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
/******/ 	var __webpack_exports__ = __webpack_require__("./src/model.ts");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});