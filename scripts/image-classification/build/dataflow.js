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

/***/ "./src/dataflow.ts":
/*!*************************!*\
  !*** ./src/dataflow.ts ***!
  \*************************/
/***/ (function(__unused_webpack_module, exports) {

eval("\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst resizeEntry = (dataset, options, context) => __awaiter(void 0, void 0, void 0, function* () {\n    const [x = '-1', y = '-1'] = options['size'];\n    const { normalize = false } = options;\n    const parsedX = parseInt(x);\n    const parsedY = parseInt(y);\n    if (parsedX == -1 || parsedY == -1)\n        return;\n    return context.dataCook.Dataset.transformDataset({\n        next: (sample) => __awaiter(void 0, void 0, void 0, function* () {\n            const resized = (yield context.dataCook.Image.read(sample.data)).resize(parsedX, parsedY);\n            if (normalize)\n                return {\n                    data: context.dataCook.Image.normalize(resized.toTensor()),\n                    label: sample.label,\n                };\n            return {\n                data: resized.toTensor(),\n                label: sample.label\n            };\n        }),\n        metadata: (meta) => __awaiter(void 0, void 0, void 0, function* () {\n            return Object.assign(Object.assign({}, meta), { dimension: {\n                    x: parsedX,\n                    y: parsedY,\n                    z: meta.dimension.z\n                } });\n        })\n    }, dataset);\n});\n/**\n * this is the data process plugin to process pasvoc format data. It supports resize the image and normalize the image\n * @param resize =[256, 256][optional] resize all images to same size\n * @param normalize =false[optional] if normalize all images to have values between [0, 1]\n */\nexports.default = resizeEntry;\n\n\n//# sourceURL=webpack://@pipcook/mobilenet-pipeline/./src/dataflow.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/dataflow.ts"](0, __webpack_exports__);
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});