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

/***/ "./dist/dataflow.js":
/*!**************************!*\
  !*** ./dist/dataflow.js ***!
  \**************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __assign = (this && this.__assign) || function () {\n    __assign = Object.assign || function(t) {\n        for (var s, i = 1, n = arguments.length; i < n; i++) {\n            s = arguments[i];\n            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))\n                t[p] = s[p];\n        }\n        return t;\n    };\n    return __assign.apply(this, arguments);\n};\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nvar __generator = (this && this.__generator) || function (thisArg, body) {\n    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;\n    return g = { next: verb(0), \"throw\": verb(1), \"return\": verb(2) }, typeof Symbol === \"function\" && (g[Symbol.iterator] = function() { return this; }), g;\n    function verb(n) { return function (v) { return step([n, v]); }; }\n    function step(op) {\n        if (f) throw new TypeError(\"Generator is already executing.\");\n        while (_) try {\n            if (f = 1, y && (t = op[0] & 2 ? y[\"return\"] : op[0] ? y[\"throw\"] || ((t = y[\"return\"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;\n            if (y = 0, t) op = [op[0] & 2, t.value];\n            switch (op[0]) {\n                case 0: case 1: t = op; break;\n                case 4: _.label++; return { value: op[1], done: false };\n                case 5: _.label++; y = op[1]; op = [0]; continue;\n                case 7: op = _.ops.pop(); _.trys.pop(); continue;\n                default:\n                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }\n                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }\n                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }\n                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }\n                    if (t[2]) _.ops.pop();\n                    _.trys.pop(); continue;\n            }\n            op = body.call(thisArg, _);\n        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }\n        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };\n    }\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nvar core_1 = __webpack_require__(/*! @pipcook/core */ \"@pipcook/core\");\nvar resizeEntry = function (dataset, options, _) { return __awaiter(void 0, void 0, void 0, function () {\n    var _a, _b, x, _c, y, _d, normalize, parsedX, parsedY, sample, img, channel, v;\n    var _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;\n    return __generator(this, function (_s) {\n        switch (_s.label) {\n            case 0:\n                _a = options['size'], _b = _a[0], x = _b === void 0 ? '-1' : _b, _c = _a[1], y = _c === void 0 ? '-1' : _c;\n                _d = options.normalize, normalize = _d === void 0 ? false : _d;\n                parsedX = parseInt(x);\n                parsedY = parseInt(y);\n                if (parsedX == -1 || parsedY == -1) {\n                    throw new TypeError('The paremeter \\'size\\' should be specified as \\'size=128&size=128\\'.');\n                }\n                ;\n                (_e = dataset.train) === null || _e === void 0 ? void 0 : _e.seek(0);\n                (_f = dataset.test) === null || _f === void 0 ? void 0 : _f.seek(0);\n                (_g = dataset.valid) === null || _g === void 0 ? void 0 : _g.seek(0);\n                (_h = dataset.predicted) === null || _h === void 0 ? void 0 : _h.seek(0);\n                return [4 /*yield*/, (((_j = dataset.train) === null || _j === void 0 ? void 0 : _j.next()) || ((_k = dataset.test) === null || _k === void 0 ? void 0 : _k.next()) || ((_l = dataset.valid) === null || _l === void 0 ? void 0 : _l.next()) || ((_m = dataset.predicted) === null || _m === void 0 ? void 0 : _m.next()))];\n            case 1:\n                sample = _s.sent();\n                if (!sample) {\n                    throw new TypeError('No data found in dataset pool.');\n                }\n                if (!sample.data.uri) return [3 /*break*/, 3];\n                return [4 /*yield*/, core_1.DataCook.Image.read(sample.data.uri)];\n            case 2:\n                img = (_s.sent()).resize(parsedX, parsedY);\n                return [3 /*break*/, 6];\n            case 3:\n                if (!sample.data.buffer) return [3 /*break*/, 5];\n                return [4 /*yield*/, core_1.DataCook.Image.read(sample.data.buffer)];\n            case 4:\n                img = (_s.sent()).resize(parsedX, parsedY);\n                return [3 /*break*/, 6];\n            case 5: throw new TypeError('No \\'uri\\' or \\'buffer\\' found in sample.');\n            case 6:\n                channel = img.channel;\n                (_o = dataset.train) === null || _o === void 0 ? void 0 : _o.seek(0);\n                (_p = dataset.test) === null || _p === void 0 ? void 0 : _p.seek(0);\n                (_q = dataset.valid) === null || _q === void 0 ? void 0 : _q.seek(0);\n                (_r = dataset.predicted) === null || _r === void 0 ? void 0 : _r.seek(0);\n                v = dataset.transform({\n                    transform: function (sample) { return __awaiter(void 0, void 0, void 0, function () {\n                        var img;\n                        return __generator(this, function (_a) {\n                            switch (_a.label) {\n                                case 0:\n                                    if (!sample.data.uri && !sample.data.buffer) {\n                                        throw new TypeError('Invalid sample.');\n                                    }\n                                    if (!sample.data.uri) return [3 /*break*/, 2];\n                                    return [4 /*yield*/, core_1.DataCook.Image.read(sample.data.uri)];\n                                case 1:\n                                    img = (_a.sent()).resize(parsedX, parsedY);\n                                    return [3 /*break*/, 5];\n                                case 2:\n                                    if (!sample.data.buffer) return [3 /*break*/, 4];\n                                    return [4 /*yield*/, core_1.DataCook.Image.read(sample.data.buffer)];\n                                case 3:\n                                    img = (_a.sent()).resize(parsedX, parsedY);\n                                    return [3 /*break*/, 5];\n                                case 4: throw new TypeError('No \\'uri\\' or \\' buffer\\' found in sample.');\n                                case 5:\n                                    if (normalize)\n                                        return [2 /*return*/, {\n                                                data: core_1.DataCook.Image.normalize(img.toTensor()),\n                                                label: sample.label\n                                            }];\n                                    return [2 /*return*/, {\n                                            data: img.toTensor(),\n                                            label: sample.label\n                                        }];\n                            }\n                        });\n                    }); },\n                    metadata: function (meta) { return __awaiter(void 0, void 0, void 0, function () {\n                        return __generator(this, function (_a) {\n                            return [2 /*return*/, __assign(__assign({}, meta), { type: core_1.DataCook.Dataset.Types.DatasetType.Image, dimension: {\n                                        x: parsedX,\n                                        y: parsedY,\n                                        z: channel\n                                    } })];\n                        });\n                    }); }\n                });\n                return [2 /*return*/, v];\n        }\n    });\n}); };\n/**\n * this is the data process plugin to process pasvoc format data. It supports resize the image and normalize the image\n * @param resize =[256, 256][optional] resize all images to same size\n * @param normalize =false[optional] if normalize all images to have values between [0, 1]\n */\nexports.default = resizeEntry;\n//# sourceMappingURL=dataflow.js.map\n\n//# sourceURL=webpack://@pipcook/image-classification-scripts/./dist/dataflow.js?");

/***/ }),

/***/ "@pipcook/core":
/*!********************************!*\
  !*** external "@pipcook/core" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("@pipcook/core");;

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
/******/ 	var __webpack_exports__ = __webpack_require__("./dist/dataflow.js");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});