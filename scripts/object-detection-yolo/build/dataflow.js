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
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __assign = (this && this.__assign) || function () {\n    __assign = Object.assign || function(t) {\n        for (var s, i = 1, n = arguments.length; i < n; i++) {\n            s = arguments[i];\n            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))\n                t[p] = s[p];\n        }\n        return t;\n    };\n    return __assign.apply(this, arguments);\n};\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nvar __generator = (this && this.__generator) || function (thisArg, body) {\n    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;\n    return g = { next: verb(0), \"throw\": verb(1), \"return\": verb(2) }, typeof Symbol === \"function\" && (g[Symbol.iterator] = function() { return this; }), g;\n    function verb(n) { return function (v) { return step([n, v]); }; }\n    function step(op) {\n        if (f) throw new TypeError(\"Generator is already executing.\");\n        while (_) try {\n            if (f = 1, y && (t = op[0] & 2 ? y[\"return\"] : op[0] ? y[\"throw\"] || ((t = y[\"return\"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;\n            if (y = 0, t) op = [op[0] & 2, t.value];\n            switch (op[0]) {\n                case 0: case 1: t = op; break;\n                case 4: _.label++; return { value: op[1], done: false };\n                case 5: _.label++; y = op[1]; op = [0]; continue;\n                case 7: op = _.ops.pop(); _.trys.pop(); continue;\n                default:\n                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }\n                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }\n                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }\n                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }\n                    if (t[2]) _.ops.pop();\n                    _.trys.pop(); continue;\n            }\n            op = body.call(thisArg, _);\n        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }\n        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };\n    }\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nvar core_1 = __webpack_require__(/*! @pipcook/core */ \"@pipcook/core\");\nvar resizeEntry = function (datasetPool, options, _) { return __awaiter(void 0, void 0, void 0, function () {\n    var _a, _b, x, _c, y, parsedX, parsedY;\n    return __generator(this, function (_d) {\n        _a = options['size'], _b = _a[0], x = _b === void 0 ? '-1' : _b, _c = _a[1], y = _c === void 0 ? '-1' : _c;\n        parsedX = parseInt(x);\n        parsedY = parseInt(y);\n        if (parsedX == -1 || parsedY == -1) {\n            throw new TypeError('Paremeter `size` is invlaid.');\n        }\n        return [2 /*return*/, datasetPool.transform({\n                transform: function (sample) { return __awaiter(void 0, void 0, void 0, function () {\n                    var originImage, originWidth, originHeight, ratioX, ratioY, resized, labels, _i, labels_1, curLabel;\n                    return __generator(this, function (_a) {\n                        switch (_a.label) {\n                            case 0:\n                                if (!sample.data.uri && !sample.data.buffer) {\n                                    throw new TypeError('sample data is empty');\n                                }\n                                return [4 /*yield*/, core_1.DataCook.Image.read(sample.data.uri || sample.data.buffer)];\n                            case 1:\n                                originImage = _a.sent();\n                                originWidth = originImage.width;\n                                originHeight = originImage.height;\n                                ratioX = parsedX / originWidth;\n                                ratioY = parsedY / originHeight;\n                                resized = originImage.resize(parsedX, parsedY);\n                                labels = sample.label;\n                                if (labels) {\n                                    for (_i = 0, labels_1 = labels; _i < labels_1.length; _i++) {\n                                        curLabel = labels_1[_i];\n                                        curLabel.bbox = [\n                                            curLabel.bbox[0] * ratioX,\n                                            curLabel.bbox[1] * ratioY,\n                                            curLabel.bbox[2] * ratioX,\n                                            curLabel.bbox[3] * ratioY\n                                        ];\n                                    }\n                                }\n                                return [2 /*return*/, {\n                                        data: {\n                                            tensor: resized.toTensor(),\n                                            originSize: {\n                                                width: originWidth,\n                                                height: originHeight\n                                            }\n                                        },\n                                        label: labels\n                                    }];\n                        }\n                    });\n                }); },\n                metadata: function (meta) { return __awaiter(void 0, void 0, void 0, function () {\n                    return __generator(this, function (_a) {\n                        return [2 /*return*/, __assign(__assign({}, meta), { type: core_1.DataCook.Dataset.Types.DatasetType.Image, dimension: {\n                                    x: parsedX,\n                                    y: parsedY,\n                                    z: 3\n                                } })];\n                    });\n                }); }\n            })];\n    });\n}); };\n/**\n * this is the data process plugin to process pasvoc format data. It supports resize the image and normalize the image\n * @param resize =[256, 256][optional] resize all images to same size\n * @param normalize =false[optional] if normalize all images to have values between [0, 1]\n */\nexports[\"default\"] = resizeEntry;\n\n\n//# sourceURL=webpack://@pipcook/plugins-tfjs-yolo/./src/dataflow.ts?");

/***/ }),

/***/ "@pipcook/core":
/*!********************************!*\
  !*** external "@pipcook/core" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("@pipcook/core");

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
/******/ 	var __webpack_exports__ = __webpack_require__("./src/dataflow.ts");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});