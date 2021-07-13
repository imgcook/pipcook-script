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
/***/ (function(__unused_webpack_module, exports) {

eval("\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst MOBILENET_MODEL_PATH = 'http://ai-sample.oss-cn-hangzhou.aliyuncs.com/pipcook/models/mobilenet/web_model/model.json';\nfunction argMax(array) {\n    return [].map.call(array, (x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];\n}\n/**\n * this is the plugin used to load a mobilenet model or load existing model.\n * @param optimizer (string | tf.train.Optimizer)[optional / default = tf.train.adam()] the optimizer of model\n * @param loss (string | string [] | {[outputName: string]: string} | LossOrMetricFn | LossOrMetricFn [] | {[outputName: string]: LossOrMetricFn}) \\\n * [optional / default = 'categoricalCrossentropy'] the loss function of model\n * @param metrics (string | LossOrMetricFn | Array | {[outputName: string]: string | LossOrMetricFn}): [optional / default = ['accuracy']]\n * @param hiddenLayerUnits (number): [optional / default = 10]\n*/\nfunction constructModel(options, labelMap, tf) {\n    return __awaiter(this, void 0, void 0, function* () {\n        let { \n        // @ts-ignore\n        optimizer = tf.train.adam(), loss = 'categoricalCrossentropy', metrics = ['accuracy'], hiddenLayerUnits = 10, } = options;\n        const NUM_CLASSES = labelMap.length;\n        // @ts-ignore\n        let model = null;\n        // @ts-ignore\n        const localModel = tf.sequential();\n        // @ts-ignore\n        const mobilenet = yield tf.loadLayersModel(MOBILENET_MODEL_PATH);\n        const layer = mobilenet.getLayer('conv_pw_13_relu');\n        // @ts-ignore\n        const truncatedMobilenet = tf.model({\n            inputs: mobilenet.inputs,\n            outputs: layer.output\n        });\n        for (const _layer of truncatedMobilenet.layers) {\n            _layer.trainable = false;\n        }\n        localModel.add(truncatedMobilenet);\n        // @ts-ignore\n        localModel.add(tf.layers.flatten({\n            // @ts-ignore\n            inputShape: layer.outputShape.slice(1)\n        }));\n        // @ts-ignore\n        localModel.add(tf.layers.dense({\n            units: hiddenLayerUnits,\n            activation: 'relu'\n        }));\n        // @ts-ignore\n        localModel.add(tf.layers.dense({\n            units: NUM_CLASSES,\n            activation: 'softmax'\n        }));\n        // @ts-ignore\n        model = localModel;\n        model.compile({\n            optimizer,\n            loss,\n            metrics\n        });\n        return model;\n    });\n}\n/**\n * this is plugin used to train tfjs model with pascal voc data format for image classification problem.\n * @param data : train data\n * @param model : model loaded before\n * @param epochs : need to specify epochs\n * @param batchSize : need to specify batch size\n * @param optimizer : need to specify optimizer\n */\n// @ts-ignore\nfunction trainModel(options, modelDir, model, dataset, tf) {\n    return __awaiter(this, void 0, void 0, function* () {\n        const { epochs = 10, batchSize = 16 } = options;\n        yield dataset.shuffle();\n        const { size } = yield dataset.getDatasetMeta();\n        const { train: trainSize } = size;\n        const batchesPerEpoch = Math.floor(trainSize / batchSize);\n        const meta = yield dataset.getDatasetMeta();\n        for (let i = 0; i < epochs; i++) {\n            console.log(`Epoch ${i}/${epochs} start`);\n            yield dataset.train.seek(0);\n            for (let j = 0; j < batchesPerEpoch; j++) {\n                const dataBatch = yield dataset.train.nextBatch(batchSize);\n                // @ts-ignore\n                const xs = tf.tidy(() => tf.stack(dataBatch.map((ele) => ele.data)));\n                // @ts-ignore\n                const ys = tf.tidy(() => tf.stack(dataBatch.map((ele) => tf.oneHot(ele.label, meta.labelMap.length))));\n                const trainRes = yield model.trainOnBatch(xs, ys);\n                if (j % Math.floor(batchesPerEpoch / 10) === 0) {\n                    console.log(`Iteration ${j}/${batchesPerEpoch} result --- loss: ${trainRes[0]} accuracy: ${trainRes[1]}`);\n                }\n            }\n        }\n        yield model.save(`file://${modelDir}`);\n    });\n}\nconst main = (api, options, context) => __awaiter(void 0, void 0, void 0, function* () {\n    const { modelDir } = context.workspace;\n    let tf;\n    try {\n        tf = yield context.importJS('@tensorflow/tfjs-node-gpu');\n    }\n    catch (_a) {\n        tf = yield context.importJS('@tensorflow/tfjs-node');\n    }\n    // @ts-ignore\n    const meta = yield api.dataset.getDatasetMeta();\n    // @ts-ignore\n    const labelMap = meta.labelMap;\n    // TODO add assert\n    const model = yield constructModel(options, labelMap, tf);\n    // @ts-ignore\n    yield trainModel(options, modelDir, model, api.dataset, tf);\n});\nexports.default = main;\n\n\n//# sourceURL=webpack://@pipcook/mobilenet-pipeline/./src/model.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/model.ts"](0, __webpack_exports__);
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});