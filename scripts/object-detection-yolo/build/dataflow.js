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

eval("\r\nvar __assign = (this && this.__assign) || function () {\r\n    __assign = Object.assign || function(t) {\r\n        for (var s, i = 1, n = arguments.length; i < n; i++) {\r\n            s = arguments[i];\r\n            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))\r\n                t[p] = s[p];\r\n        }\r\n        return t;\r\n    };\r\n    return __assign.apply(this, arguments);\r\n};\r\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\r\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\r\n    return new (P || (P = Promise))(function (resolve, reject) {\r\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\r\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\r\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n    });\r\n};\r\nvar __generator = (this && this.__generator) || function (thisArg, body) {\r\n    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;\r\n    return g = { next: verb(0), \"throw\": verb(1), \"return\": verb(2) }, typeof Symbol === \"function\" && (g[Symbol.iterator] = function() { return this; }), g;\r\n    function verb(n) { return function (v) { return step([n, v]); }; }\r\n    function step(op) {\r\n        if (f) throw new TypeError(\"Generator is already executing.\");\r\n        while (_) try {\r\n            if (f = 1, y && (t = op[0] & 2 ? y[\"return\"] : op[0] ? y[\"throw\"] || ((t = y[\"return\"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;\r\n            if (y = 0, t) op = [op[0] & 2, t.value];\r\n            switch (op[0]) {\r\n                case 0: case 1: t = op; break;\r\n                case 4: _.label++; return { value: op[1], done: false };\r\n                case 5: _.label++; y = op[1]; op = [0]; continue;\r\n                case 7: op = _.ops.pop(); _.trys.pop(); continue;\r\n                default:\r\n                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }\r\n                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }\r\n                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }\r\n                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }\r\n                    if (t[2]) _.ops.pop();\r\n                    _.trys.pop(); continue;\r\n            }\r\n            op = body.call(thisArg, _);\r\n        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }\r\n        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };\r\n    }\r\n};\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nvar core_1 = __webpack_require__(/*! @pipcook/core */ \"@pipcook/core\");\r\nvar resizeEntry = function (datasetPool, options, _) { return __awaiter(void 0, void 0, void 0, function () {\r\n    var _a, _b, x, _c, y, parsedX, parsedY;\r\n    return __generator(this, function (_d) {\r\n        _a = options['size'], _b = _a[0], x = _b === void 0 ? '-1' : _b, _c = _a[1], y = _c === void 0 ? '-1' : _c;\r\n        parsedX = parseInt(x);\r\n        parsedY = parseInt(y);\r\n        if (parsedX == -1 || parsedY == -1) {\r\n            throw new TypeError('Paremeter `size` is invlaid.');\r\n        }\r\n        return [2 /*return*/, datasetPool.transform({\r\n                transform: function (sample) { return __awaiter(void 0, void 0, void 0, function () {\r\n                    var originImage, originWidth, originHeight, ratioX, ratioY, resized, labels, _i, labels_1, curLabel;\r\n                    return __generator(this, function (_a) {\r\n                        switch (_a.label) {\r\n                            case 0:\r\n                                if (!sample.data.uri && !sample.data.buffer) {\r\n                                    throw new TypeError('sample data is empty');\r\n                                }\r\n                                return [4 /*yield*/, core_1.DataCook.Image.read(sample.data.uri || sample.data.buffer)];\r\n                            case 1:\r\n                                originImage = _a.sent();\r\n                                originWidth = originImage.width;\r\n                                originHeight = originImage.height;\r\n                                ratioX = parsedX / originWidth;\r\n                                ratioY = parsedY / originHeight;\r\n                                resized = originImage.resize(parsedX, parsedY);\r\n                                labels = sample.label;\r\n                                if (labels) {\r\n                                    for (_i = 0, labels_1 = labels; _i < labels_1.length; _i++) {\r\n                                        curLabel = labels_1[_i];\r\n                                        curLabel.bbox = [\r\n                                            curLabel.bbox[0] * ratioX,\r\n                                            curLabel.bbox[1] * ratioY,\r\n                                            curLabel.bbox[2] * ratioX,\r\n                                            curLabel.bbox[3] * ratioY\r\n                                        ];\r\n                                    }\r\n                                }\r\n                                return [2 /*return*/, {\r\n                                        data: {\r\n                                            tensor: resized.toTensor(),\r\n                                            originSize: {\r\n                                                width: originWidth,\r\n                                                height: originHeight\r\n                                            }\r\n                                        },\r\n                                        label: labels\r\n                                    }];\r\n                        }\r\n                    });\r\n                }); },\r\n                metadata: function (meta) { return __awaiter(void 0, void 0, void 0, function () {\r\n                    return __generator(this, function (_a) {\r\n                        return [2 /*return*/, __assign(__assign({}, meta), { type: core_1.DataCook.Dataset.Types.DatasetType.Image, dimension: {\r\n                                    x: parsedX,\r\n                                    y: parsedY,\r\n                                    z: 3\r\n                                } })];\r\n                    });\r\n                }); }\r\n            })];\r\n    });\r\n}); };\r\n/**\r\n * this is the data process plugin to process pasvoc format data. It supports resize the image and normalize the image\r\n * @param resize =[256, 256][optional] resize all images to same size\r\n * @param normalize =false[optional] if normalize all images to have values between [0, 1]\r\n */\r\nexports.default = resizeEntry;\r\n\n\n//# sourceURL=webpack://@pipcook/plugins-tfjs-yolo/./src/dataflow.ts?");

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