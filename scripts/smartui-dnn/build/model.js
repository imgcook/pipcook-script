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

eval("\nvar __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });\n}) : (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    o[k2] = m[k];\n}));\nvar __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {\n    Object.defineProperty(o, \"default\", { enumerable: true, value: v });\n}) : function(o, v) {\n    o[\"default\"] = v;\n});\nvar __importStar = (this && this.__importStar) || function (mod) {\n    if (mod && mod.__esModule) return mod;\n    var result = {};\n    if (mod != null) for (var k in mod) if (k !== \"default\" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);\n    __setModuleDefault(result, mod);\n    return result;\n};\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nvar __generator = (this && this.__generator) || function (thisArg, body) {\n    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;\n    return g = { next: verb(0), \"throw\": verb(1), \"return\": verb(2) }, typeof Symbol === \"function\" && (g[Symbol.iterator] = function() { return this; }), g;\n    function verb(n) { return function (v) { return step([n, v]); }; }\n    function step(op) {\n        if (f) throw new TypeError(\"Generator is already executing.\");\n        while (_) try {\n            if (f = 1, y && (t = op[0] & 2 ? y[\"return\"] : op[0] ? y[\"throw\"] || ((t = y[\"return\"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;\n            if (y = 0, t) op = [op[0] & 2, t.value];\n            switch (op[0]) {\n                case 0: case 1: t = op; break;\n                case 4: _.label++; return { value: op[1], done: false };\n                case 5: _.label++; y = op[1]; op = [0]; continue;\n                case 7: op = _.ops.pop(); _.trys.pop(); continue;\n                default:\n                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }\n                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }\n                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }\n                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }\n                    if (t[2]) _.ops.pop();\n                    _.trys.pop(); continue;\n            }\n            op = body.call(thisArg, _);\n        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }\n        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };\n    }\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nvar tf = __importStar(__webpack_require__(/*! @tensorflow/tfjs-node */ \"@tensorflow/tfjs-node\"));\nfunction createModel(featureNumbers) {\n    var model = tf.sequential();\n    model.add(tf.layers.dense({\n        inputShape: [featureNumbers],\n        units: 100,\n        kernelInitializer: 'truncatedNormal',\n        biasInitializer: 'zeros'\n    }));\n    model.add(tf.layers.leakyReLU());\n    model.add(tf.layers.dense({\n        units: 50,\n        kernelInitializer: 'truncatedNormal',\n        biasInitializer: 'zeros'\n    }));\n    model.add(tf.layers.leakyReLU());\n    model.add(tf.layers.dense({\n        units: 1,\n        kernelInitializer: 'truncatedNormal',\n        biasInitializer: 'zeros',\n        activation: 'sigmoid'\n    }));\n    return model;\n}\nvar main = function (api, options, context) { return __awaiter(void 0, void 0, void 0, function () {\n    var modelDir, _a, epochs, _b, batchSize, meta, featureNumbers, model, i, j, _loop_1, state_1;\n    var _c, _d;\n    return __generator(this, function (_e) {\n        switch (_e.label) {\n            case 0:\n                modelDir = context.workspace.modelDir;\n                _a = options.epochs, epochs = _a === void 0 ? 10 : _a, _b = options.batchSize, batchSize = _b === void 0 ? 16 : _b;\n                if (!api.dataset.train) {\n                    throw new TypeError('No train data found.');\n                }\n                return [4 /*yield*/, api.dataset.getDatasetMeta()];\n            case 1:\n                meta = _e.sent();\n                featureNumbers = (_c = meta === null || meta === void 0 ? void 0 : meta.dataKeys) === null || _c === void 0 ? void 0 : _c.length;\n                model = createModel(featureNumbers);\n                model.compile({\n                    optimizer: tf.train.adam(1e-3),\n                    loss: tf.losses.sigmoidCrossEntropy,\n                    metrics: 'accuracy'\n                });\n                i = 0;\n                _e.label = 2;\n            case 2:\n                if (!(i < epochs)) return [3 /*break*/, 7];\n                console.log(\"Epoch \" + i + \"/\" + epochs + \" start\");\n                return [4 /*yield*/, api.dataset.train.seek(0)];\n            case 3:\n                _e.sent();\n                j = 0;\n                _loop_1 = function () {\n                    var batch, xs, ys, res;\n                    return __generator(this, function (_f) {\n                        switch (_f.label) {\n                            case 0: return [4 /*yield*/, ((_d = api.dataset.train) === null || _d === void 0 ? void 0 : _d.nextBatch(batchSize))];\n                            case 1:\n                                batch = _f.sent();\n                                batch = batch.filter(function (ele) { return (ele.label !== undefined && ele.label !== null); });\n                                if (!(batch.length > 0)) {\n                                    return [2 /*return*/, \"break\"];\n                                }\n                                xs = tf.tidy(function () { return tf.stack(batch.map(function (ele) { return ele.data; })); });\n                                ys = tf.tidy(function () { return tf.stack(batch.map(function (ele) { return ele.label; })); });\n                                return [4 /*yield*/, model.trainOnBatch(xs, ys)];\n                            case 2:\n                                res = _f.sent();\n                                if (j % 10 === 0) {\n                                    console.log(\"Epoch \" + i + \" - Iteration \" + j + \" : loss is \" + res[0] + \" and accuracy is \" + res[1]);\n                                }\n                                return [2 /*return*/];\n                        }\n                    });\n                };\n                _e.label = 4;\n            case 4:\n                if (false) {}\n                return [5 /*yield**/, _loop_1()];\n            case 5:\n                state_1 = _e.sent();\n                if (state_1 === \"break\")\n                    return [3 /*break*/, 6];\n                return [3 /*break*/, 4];\n            case 6:\n                i++;\n                return [3 /*break*/, 2];\n            case 7: return [4 /*yield*/, model.save(\"file://\" + modelDir)];\n            case 8:\n                _e.sent();\n                return [2 /*return*/];\n        }\n    });\n}); };\nexports.default = main;\n\n\n//# sourceURL=webpack://@pipcook/plugins-smartui-logic-regression/./src/model.ts?");

/***/ }),

/***/ "@tensorflow/tfjs-node":
/*!****************************************!*\
  !*** external "@tensorflow/tfjs-node" ***!
  \****************************************/
/***/ ((module) => {

module.exports = require("@tensorflow/tfjs-node");

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