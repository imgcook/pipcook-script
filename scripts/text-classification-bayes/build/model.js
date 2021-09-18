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
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/at-least-node/index.js":
/*!*********************************************!*\
  !*** ./node_modules/at-least-node/index.js ***!
  \*********************************************/
/***/ ((module) => {

eval("module.exports = r => {\n  const n = process.versions.node.split('.').map(x => parseInt(x, 10))\n  r = r.split('.').map(x => parseInt(x, 10))\n  return n[0] > r[0] || (n[0] === r[0] && (n[1] > r[1] || (n[1] === r[1] && n[2] >= r[2])))\n}\n\n\n//# sourceURL=webpack://@pipcook/plugins-bayesian-model-define/./node_modules/at-least-node/index.js?");

/***/ }),

/***/ "./node_modules/fs-extra/lib/copy-sync/copy-sync.js":
/*!**********************************************************!*\
  !*** ./node_modules/fs-extra/lib/copy-sync/copy-sync.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nconst fs = __webpack_require__(/*! graceful-fs */ \"./node_modules/graceful-fs/graceful-fs.js\")\nconst path = __webpack_require__(/*! path */ \"path\")\nconst mkdirsSync = __webpack_require__(/*! ../mkdirs */ \"./node_modules/fs-extra/lib/mkdirs/index.js\").mkdirsSync\nconst utimesMillisSync = __webpack_require__(/*! ../util/utimes */ \"./node_modules/fs-extra/lib/util/utimes.js\").utimesMillisSync\nconst stat = __webpack_require__(/*! ../util/stat */ \"./node_modules/fs-extra/lib/util/stat.js\")\n\nfunction copySync (src, dest, opts) {\n  if (typeof opts === 'function') {\n    opts = { filter: opts }\n  }\n\n  opts = opts || {}\n  opts.clobber = 'clobber' in opts ? !!opts.clobber : true // default to true for now\n  opts.overwrite = 'overwrite' in opts ? !!opts.overwrite : opts.clobber // overwrite falls back to clobber\n\n  // Warn about using preserveTimestamps on 32-bit node\n  if (opts.preserveTimestamps && process.arch === 'ia32') {\n    console.warn(`fs-extra: Using the preserveTimestamps option in 32-bit node is not recommended;\\n\n    see https://github.com/jprichardson/node-fs-extra/issues/269`)\n  }\n\n  const { srcStat, destStat } = stat.checkPathsSync(src, dest, 'copy')\n  stat.checkParentPathsSync(src, srcStat, dest, 'copy')\n  return handleFilterAndCopy(destStat, src, dest, opts)\n}\n\nfunction handleFilterAndCopy (destStat, src, dest, opts) {\n  if (opts.filter && !opts.filter(src, dest)) return\n  const destParent = path.dirname(dest)\n  if (!fs.existsSync(destParent)) mkdirsSync(destParent)\n  return startCopy(destStat, src, dest, opts)\n}\n\nfunction startCopy (destStat, src, dest, opts) {\n  if (opts.filter && !opts.filter(src, dest)) return\n  return getStats(destStat, src, dest, opts)\n}\n\nfunction getStats (destStat, src, dest, opts) {\n  const statSync = opts.dereference ? fs.statSync : fs.lstatSync\n  const srcStat = statSync(src)\n\n  if (srcStat.isDirectory()) return onDir(srcStat, destStat, src, dest, opts)\n  else if (srcStat.isFile() ||\n           srcStat.isCharacterDevice() ||\n           srcStat.isBlockDevice()) return onFile(srcStat, destStat, src, dest, opts)\n  else if (srcStat.isSymbolicLink()) return onLink(destStat, src, dest, opts)\n}\n\nfunction onFile (srcStat, destStat, src, dest, opts) {\n  if (!destStat) return copyFile(srcStat, src, dest, opts)\n  return mayCopyFile(srcStat, src, dest, opts)\n}\n\nfunction mayCopyFile (srcStat, src, dest, opts) {\n  if (opts.overwrite) {\n    fs.unlinkSync(dest)\n    return copyFile(srcStat, src, dest, opts)\n  } else if (opts.errorOnExist) {\n    throw new Error(`'${dest}' already exists`)\n  }\n}\n\nfunction copyFile (srcStat, src, dest, opts) {\n  fs.copyFileSync(src, dest)\n  if (opts.preserveTimestamps) handleTimestamps(srcStat.mode, src, dest)\n  return setDestMode(dest, srcStat.mode)\n}\n\nfunction handleTimestamps (srcMode, src, dest) {\n  // Make sure the file is writable before setting the timestamp\n  // otherwise open fails with EPERM when invoked with 'r+'\n  // (through utimes call)\n  if (fileIsNotWritable(srcMode)) makeFileWritable(dest, srcMode)\n  return setDestTimestamps(src, dest)\n}\n\nfunction fileIsNotWritable (srcMode) {\n  return (srcMode & 0o200) === 0\n}\n\nfunction makeFileWritable (dest, srcMode) {\n  return setDestMode(dest, srcMode | 0o200)\n}\n\nfunction setDestMode (dest, srcMode) {\n  return fs.chmodSync(dest, srcMode)\n}\n\nfunction setDestTimestamps (src, dest) {\n  // The initial srcStat.atime cannot be trusted\n  // because it is modified by the read(2) system call\n  // (See https://nodejs.org/api/fs.html#fs_stat_time_values)\n  const updatedSrcStat = fs.statSync(src)\n  return utimesMillisSync(dest, updatedSrcStat.atime, updatedSrcStat.mtime)\n}\n\nfunction onDir (srcStat, destStat, src, dest, opts) {\n  if (!destStat) return mkDirAndCopy(srcStat.mode, src, dest, opts)\n  if (destStat && !destStat.isDirectory()) {\n    throw new Error(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`)\n  }\n  return copyDir(src, dest, opts)\n}\n\nfunction mkDirAndCopy (srcMode, src, dest, opts) {\n  fs.mkdirSync(dest)\n  copyDir(src, dest, opts)\n  return setDestMode(dest, srcMode)\n}\n\nfunction copyDir (src, dest, opts) {\n  fs.readdirSync(src).forEach(item => copyDirItem(item, src, dest, opts))\n}\n\nfunction copyDirItem (item, src, dest, opts) {\n  const srcItem = path.join(src, item)\n  const destItem = path.join(dest, item)\n  const { destStat } = stat.checkPathsSync(srcItem, destItem, 'copy')\n  return startCopy(destStat, srcItem, destItem, opts)\n}\n\nfunction onLink (destStat, src, dest, opts) {\n  let resolvedSrc = fs.readlinkSync(src)\n  if (opts.dereference) {\n    resolvedSrc = path.resolve(process.cwd(), resolvedSrc)\n  }\n\n  if (!destStat) {\n    return fs.symlinkSync(resolvedSrc, dest)\n  } else {\n    let resolvedDest\n    try {\n      resolvedDest = fs.readlinkSync(dest)\n    } catch (err) {\n      // dest exists and is a regular file or directory,\n      // Windows may throw UNKNOWN error. If dest already exists,\n      // fs throws error anyway, so no need to guard against it here.\n      if (err.code === 'EINVAL' || err.code === 'UNKNOWN') return fs.symlinkSync(resolvedSrc, dest)\n      throw err\n    }\n    if (opts.dereference) {\n      resolvedDest = path.resolve(process.cwd(), resolvedDest)\n    }\n    if (stat.isSrcSubdir(resolvedSrc, resolvedDest)) {\n      throw new Error(`Cannot copy '${resolvedSrc}' to a subdirectory of itself, '${resolvedDest}'.`)\n    }\n\n    // prevent copy if src is a subdir of dest since unlinking\n    // dest in this case would result in removing src contents\n    // and therefore a broken symlink would be created.\n    if (fs.statSync(dest).isDirectory() && stat.isSrcSubdir(resolvedDest, resolvedSrc)) {\n      throw new Error(`Cannot overwrite '${resolvedDest}' with '${resolvedSrc}'.`)\n    }\n    return copyLink(resolvedSrc, dest)\n  }\n}\n\nfunction copyLink (resolvedSrc, dest) {\n  fs.unlinkSync(dest)\n  return fs.symlinkSync(resolvedSrc, dest)\n}\n\nmodule.exports = copySync\n\n\n//# sourceURL=webpack://@pipcook/plugins-bayesian-model-define/./node_modules/fs-extra/lib/copy-sync/copy-sync.js?");

/***/ }),

/***/ "./node_modules/fs-extra/lib/copy-sync/index.js":
/*!******************************************************!*\
  !*** ./node_modules/fs-extra/lib/copy-sync/index.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nmodule.exports = {\n  copySync: __webpack_require__(/*! ./copy-sync */ \"./node_modules/fs-extra/lib/copy-sync/copy-sync.js\")\n}\n\n\n//# sourceURL=webpack://@pipcook/plugins-bayesian-model-define/./node_modules/fs-extra/lib/copy-sync/index.js?");

/***/ }),

/***/ "./node_modules/fs-extra/lib/copy/copy.js":
/*!************************************************!*\
  !*** ./node_modules/fs-extra/lib/copy/copy.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nconst fs = __webpack_require__(/*! graceful-fs */ \"./node_modules/graceful-fs/graceful-fs.js\")\nconst path = __webpack_require__(/*! path */ \"path\")\nconst mkdirs = __webpack_require__(/*! ../mkdirs */ \"./node_modules/fs-extra/lib/mkdirs/index.js\").mkdirs\nconst pathExists = __webpack_require__(/*! ../path-exists */ \"./node_modules/fs-extra/lib/path-exists/index.js\").pathExists\nconst utimesMillis = __webpack_require__(/*! ../util/utimes */ \"./node_modules/fs-extra/lib/util/utimes.js\").utimesMillis\nconst stat = __webpack_require__(/*! ../util/stat */ \"./node_modules/fs-extra/lib/util/stat.js\")\n\nfunction copy (src, dest, opts, cb) {\n  if (typeof opts === 'function' && !cb) {\n    cb = opts\n    opts = {}\n  } else if (typeof opts === 'function') {\n    opts = { filter: opts }\n  }\n\n  cb = cb || function () {}\n  opts = opts || {}\n\n  opts.clobber = 'clobber' in opts ? !!opts.clobber : true // default to true for now\n  opts.overwrite = 'overwrite' in opts ? !!opts.overwrite : opts.clobber // overwrite falls back to clobber\n\n  // Warn about using preserveTimestamps on 32-bit node\n  if (opts.preserveTimestamps && process.arch === 'ia32') {\n    console.warn(`fs-extra: Using the preserveTimestamps option in 32-bit node is not recommended;\\n\n    see https://github.com/jprichardson/node-fs-extra/issues/269`)\n  }\n\n  stat.checkPaths(src, dest, 'copy', (err, stats) => {\n    if (err) return cb(err)\n    const { srcStat, destStat } = stats\n    stat.checkParentPaths(src, srcStat, dest, 'copy', err => {\n      if (err) return cb(err)\n      if (opts.filter) return handleFilter(checkParentDir, destStat, src, dest, opts, cb)\n      return checkParentDir(destStat, src, dest, opts, cb)\n    })\n  })\n}\n\nfunction checkParentDir (destStat, src, dest, opts, cb) {\n  const destParent = path.dirname(dest)\n  pathExists(destParent, (err, dirExists) => {\n    if (err) return cb(err)\n    if (dirExists) return startCopy(destStat, src, dest, opts, cb)\n    mkdirs(destParent, err => {\n      if (err) return cb(err)\n      return startCopy(destStat, src, dest, opts, cb)\n    })\n  })\n}\n\nfunction handleFilter (onInclude, destStat, src, dest, opts, cb) {\n  Promise.resolve(opts.filter(src, dest)).then(include => {\n    if (include) return onInclude(destStat, src, dest, opts, cb)\n    return cb()\n  }, error => cb(error))\n}\n\nfunction startCopy (destStat, src, dest, opts, cb) {\n  if (opts.filter) return handleFilter(getStats, destStat, src, dest, opts, cb)\n  return getStats(destStat, src, dest, opts, cb)\n}\n\nfunction getStats (destStat, src, dest, opts, cb) {\n  const stat = opts.dereference ? fs.stat : fs.lstat\n  stat(src, (err, srcStat) => {\n    if (err) return cb(err)\n\n    if (srcStat.isDirectory()) return onDir(srcStat, destStat, src, dest, opts, cb)\n    else if (srcStat.isFile() ||\n             srcStat.isCharacterDevice() ||\n             srcStat.isBlockDevice()) return onFile(srcStat, destStat, src, dest, opts, cb)\n    else if (srcStat.isSymbolicLink()) return onLink(destStat, src, dest, opts, cb)\n  })\n}\n\nfunction onFile (srcStat, destStat, src, dest, opts, cb) {\n  if (!destStat) return copyFile(srcStat, src, dest, opts, cb)\n  return mayCopyFile(srcStat, src, dest, opts, cb)\n}\n\nfunction mayCopyFile (srcStat, src, dest, opts, cb) {\n  if (opts.overwrite) {\n    fs.unlink(dest, err => {\n      if (err) return cb(err)\n      return copyFile(srcStat, src, dest, opts, cb)\n    })\n  } else if (opts.errorOnExist) {\n    return cb(new Error(`'${dest}' already exists`))\n  } else return cb()\n}\n\nfunction copyFile (srcStat, src, dest, opts, cb) {\n  fs.copyFile(src, dest, err => {\n    if (err) return cb(err)\n    if (opts.preserveTimestamps) return handleTimestampsAndMode(srcStat.mode, src, dest, cb)\n    return setDestMode(dest, srcStat.mode, cb)\n  })\n}\n\nfunction handleTimestampsAndMode (srcMode, src, dest, cb) {\n  // Make sure the file is writable before setting the timestamp\n  // otherwise open fails with EPERM when invoked with 'r+'\n  // (through utimes call)\n  if (fileIsNotWritable(srcMode)) {\n    return makeFileWritable(dest, srcMode, err => {\n      if (err) return cb(err)\n      return setDestTimestampsAndMode(srcMode, src, dest, cb)\n    })\n  }\n  return setDestTimestampsAndMode(srcMode, src, dest, cb)\n}\n\nfunction fileIsNotWritable (srcMode) {\n  return (srcMode & 0o200) === 0\n}\n\nfunction makeFileWritable (dest, srcMode, cb) {\n  return setDestMode(dest, srcMode | 0o200, cb)\n}\n\nfunction setDestTimestampsAndMode (srcMode, src, dest, cb) {\n  setDestTimestamps(src, dest, err => {\n    if (err) return cb(err)\n    return setDestMode(dest, srcMode, cb)\n  })\n}\n\nfunction setDestMode (dest, srcMode, cb) {\n  return fs.chmod(dest, srcMode, cb)\n}\n\nfunction setDestTimestamps (src, dest, cb) {\n  // The initial srcStat.atime cannot be trusted\n  // because it is modified by the read(2) system call\n  // (See https://nodejs.org/api/fs.html#fs_stat_time_values)\n  fs.stat(src, (err, updatedSrcStat) => {\n    if (err) return cb(err)\n    return utimesMillis(dest, updatedSrcStat.atime, updatedSrcStat.mtime, cb)\n  })\n}\n\nfunction onDir (srcStat, destStat, src, dest, opts, cb) {\n  if (!destStat) return mkDirAndCopy(srcStat.mode, src, dest, opts, cb)\n  if (destStat && !destStat.isDirectory()) {\n    return cb(new Error(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`))\n  }\n  return copyDir(src, dest, opts, cb)\n}\n\nfunction mkDirAndCopy (srcMode, src, dest, opts, cb) {\n  fs.mkdir(dest, err => {\n    if (err) return cb(err)\n    copyDir(src, dest, opts, err => {\n      if (err) return cb(err)\n      return setDestMode(dest, srcMode, cb)\n    })\n  })\n}\n\nfunction copyDir (src, dest, opts, cb) {\n  fs.readdir(src, (err, items) => {\n    if (err) return cb(err)\n    return copyDirItems(items, src, dest, opts, cb)\n  })\n}\n\nfunction copyDirItems (items, src, dest, opts, cb) {\n  const item = items.pop()\n  if (!item) return cb()\n  return copyDirItem(items, item, src, dest, opts, cb)\n}\n\nfunction copyDirItem (items, item, src, dest, opts, cb) {\n  const srcItem = path.join(src, item)\n  const destItem = path.join(dest, item)\n  stat.checkPaths(srcItem, destItem, 'copy', (err, stats) => {\n    if (err) return cb(err)\n    const { destStat } = stats\n    startCopy(destStat, srcItem, destItem, opts, err => {\n      if (err) return cb(err)\n      return copyDirItems(items, src, dest, opts, cb)\n    })\n  })\n}\n\nfunction onLink (destStat, src, dest, opts, cb) {\n  fs.readlink(src, (err, resolvedSrc) => {\n    if (err) return cb(err)\n    if (opts.dereference) {\n      resolvedSrc = path.resolve(process.cwd(), resolvedSrc)\n    }\n\n    if (!destStat) {\n      return fs.symlink(resolvedSrc, dest, cb)\n    } else {\n      fs.readlink(dest, (err, resolvedDest) => {\n        if (err) {\n          // dest exists and is a regular file or directory,\n          // Windows may throw UNKNOWN error. If dest already exists,\n          // fs throws error anyway, so no need to guard against it here.\n          if (err.code === 'EINVAL' || err.code === 'UNKNOWN') return fs.symlink(resolvedSrc, dest, cb)\n          return cb(err)\n        }\n        if (opts.dereference) {\n          resolvedDest = path.resolve(process.cwd(), resolvedDest)\n        }\n        if (stat.isSrcSubdir(resolvedSrc, resolvedDest)) {\n          return cb(new Error(`Cannot copy '${resolvedSrc}' to a subdirectory of itself, '${resolvedDest}'.`))\n        }\n\n        // do not copy if src is a subdir of dest since unlinking\n        // dest in this case would result in removing src contents\n        // and therefore a broken symlink would be created.\n        if (destStat.isDirectory() && stat.isSrcSubdir(resolvedDest, resolvedSrc)) {\n          return cb(new Error(`Cannot overwrite '${resolvedDest}' with '${resolvedSrc}'.`))\n        }\n        return copyLink(resolvedSrc, dest, cb)\n      })\n    }\n  })\n}\n\nfunction copyLink (resolvedSrc, dest, cb) {\n  fs.unlink(dest, err => {\n    if (err) return cb(err)\n    return fs.symlink(resolvedSrc, dest, cb)\n  })\n}\n\nmodule.exports = copy\n\n\n//# sourceURL=webpack://@pipcook/plugins-bayesian-model-define/./node_modules/fs-extra/lib/copy/copy.js?");

/***/ }),

/***/ "./node_modules/fs-extra/lib/copy/index.js":
/*!*************************************************!*\
  !*** ./node_modules/fs-extra/lib/copy/index.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nconst u = __webpack_require__(/*! universalify */ \"./node_modules/universalify/index.js\").fromCallback\nmodule.exports = {\n  copy: u(__webpack_require__(/*! ./copy */ \"./node_modules/fs-extra/lib/copy/copy.js\"))\n}\n\n\n//# sourceURL=webpack://@pipcook/plugins-bayesian-model-define/./node_modules/fs-extra/lib/copy/index.js?");

/***/ }),

/***/ "./node_modules/fs-extra/lib/empty/index.js":
/*!**************************************************!*\
  !*** ./node_modules/fs-extra/lib/empty/index.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nconst u = __webpack_require__(/*! universalify */ \"./node_modules/universalify/index.js\").fromCallback\nconst fs = __webpack_require__(/*! graceful-fs */ \"./node_modules/graceful-fs/graceful-fs.js\")\nconst path = __webpack_require__(/*! path */ \"path\")\nconst mkdir = __webpack_require__(/*! ../mkdirs */ \"./node_modules/fs-extra/lib/mkdirs/index.js\")\nconst remove = __webpack_require__(/*! ../remove */ \"./node_modules/fs-extra/lib/remove/index.js\")\n\nconst emptyDir = u(function emptyDir (dir, callback) {\n  callback = callback || function () {}\n  fs.readdir(dir, (err, items) => {\n    if (err) return mkdir.mkdirs(dir, callback)\n\n    items = items.map(item => path.join(dir, item))\n\n    deleteItem()\n\n    function deleteItem () {\n      const item = items.pop()\n      if (!item) return callback()\n      remove.remove(item, err => {\n        if (err) return callback(err)\n        deleteItem()\n      })\n    }\n  })\n})\n\nfunction emptyDirSync (dir) {\n  let items\n  try {\n    items = fs.readdirSync(dir)\n  } catch {\n    return mkdir.mkdirsSync(dir)\n  }\n\n  items.forEach(item => {\n    item = path.join(dir, item)\n    remove.removeSync(item)\n  })\n}\n\nmodule.exports = {\n  emptyDirSync,\n  emptydirSync: emptyDirSync,\n  emptyDir,\n  emptydir: emptyDir\n}\n\n\n//# sourceURL=webpack://@pipcook/plugins-bayesian-model-define/./node_modules/fs-extra/lib/empty/index.js?");

/***/ }),

/***/ "./node_modules/fs-extra/lib/ensure/file.js":
/*!**************************************************!*\
  !*** ./node_modules/fs-extra/lib/ensure/file.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nconst u = __webpack_require__(/*! universalify */ \"./node_modules/universalify/index.js\").fromCallback\nconst path = __webpack_require__(/*! path */ \"path\")\nconst fs = __webpack_require__(/*! graceful-fs */ \"./node_modules/graceful-fs/graceful-fs.js\")\nconst mkdir = __webpack_require__(/*! ../mkdirs */ \"./node_modules/fs-extra/lib/mkdirs/index.js\")\n\nfunction createFile (file, callback) {\n  function makeFile () {\n    fs.writeFile(file, '', err => {\n      if (err) return callback(err)\n      callback()\n    })\n  }\n\n  fs.stat(file, (err, stats) => { // eslint-disable-line handle-callback-err\n    if (!err && stats.isFile()) return callback()\n    const dir = path.dirname(file)\n    fs.stat(dir, (err, stats) => {\n      if (err) {\n        // if the directory doesn't exist, make it\n        if (err.code === 'ENOENT') {\n          return mkdir.mkdirs(dir, err => {\n            if (err) return callback(err)\n            makeFile()\n          })\n        }\n        return callback(err)\n      }\n\n      if (stats.isDirectory()) makeFile()\n      else {\n        // parent is not a directory\n        // This is just to cause an internal ENOTDIR error to be thrown\n        fs.readdir(dir, err => {\n          if (err) return callback(err)\n        })\n      }\n    })\n  })\n}\n\nfunction createFileSync (file) {\n  let stats\n  try {\n    stats = fs.statSync(file)\n  } catch {}\n  if (stats && stats.isFile()) return\n\n  const dir = path.dirname(file)\n  try {\n    if (!fs.statSync(dir).isDirectory()) {\n      // parent is not a directory\n      // This is just to cause an internal ENOTDIR error to be thrown\n      fs.readdirSync(dir)\n    }\n  } catch (err) {\n    // If the stat call above failed because the directory doesn't exist, create it\n    if (err && err.code === 'ENOENT') mkdir.mkdirsSync(dir)\n    else throw err\n  }\n\n  fs.writeFileSync(file, '')\n}\n\nmodule.exports = {\n  createFile: u(createFile),\n  createFileSync\n}\n\n\n//# sourceURL=webpack://@pipcook/plugins-bayesian-model-define/./node_modules/fs-extra/lib/ensure/file.js?");

/***/ }),

/***/ "./node_modules/fs-extra/lib/ensure/index.js":
/*!***************************************************!*\
  !*** ./node_modules/fs-extra/lib/ensure/index.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nconst file = __webpack_require__(/*! ./file */ \"./node_modules/fs-extra/lib/ensure/file.js\")\nconst link = __webpack_require__(/*! ./link */ \"./node_modules/fs-extra/lib/ensure/link.js\")\nconst symlink = __webpack_require__(/*! ./symlink */ \"./node_modules/fs-extra/lib/ensure/symlink.js\")\n\nmodule.exports = {\n  // file\n  createFile: file.createFile,\n  createFileSync: file.createFileSync,\n  ensureFile: file.createFile,\n  ensureFileSync: file.createFileSync,\n  // link\n  createLink: link.createLink,\n  createLinkSync: link.createLinkSync,\n  ensureLink: link.createLink,\n  ensureLinkSync: link.createLinkSync,\n  // symlink\n  createSymlink: symlink.createSymlink,\n  createSymlinkSync: symlink.createSymlinkSync,\n  ensureSymlink: symlink.createSymlink,\n  ensureSymlinkSync: symlink.createSymlinkSync\n}\n\n\n//# sourceURL=webpack://@pipcook/plugins-bayesian-model-define/./node_modules/fs-extra/lib/ensure/index.js?");

/***/ }),

/***/ "./node_modules/fs-extra/lib/ensure/link.js":
/*!**************************************************!*\
  !*** ./node_modules/fs-extra/lib/ensure/link.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nconst u = __webpack_require__(/*! universalify */ \"./node_modules/universalify/index.js\").fromCallback\nconst path = __webpack_require__(/*! path */ \"path\")\nconst fs = __webpack_require__(/*! graceful-fs */ \"./node_modules/graceful-fs/graceful-fs.js\")\nconst mkdir = __webpack_require__(/*! ../mkdirs */ \"./node_modules/fs-extra/lib/mkdirs/index.js\")\nconst pathExists = __webpack_require__(/*! ../path-exists */ \"./node_modules/fs-extra/lib/path-exists/index.js\").pathExists\n\nfunction createLink (srcpath, dstpath, callback) {\n  function makeLink (srcpath, dstpath) {\n    fs.link(srcpath, dstpath, err => {\n      if (err) return callback(err)\n      callback(null)\n    })\n  }\n\n  pathExists(dstpath, (err, destinationExists) => {\n    if (err) return callback(err)\n    if (destinationExists) return callback(null)\n    fs.lstat(srcpath, (err) => {\n      if (err) {\n        err.message = err.message.replace('lstat', 'ensureLink')\n        return callback(err)\n      }\n\n      const dir = path.dirname(dstpath)\n      pathExists(dir, (err, dirExists) => {\n        if (err) return callback(err)\n        if (dirExists) return makeLink(srcpath, dstpath)\n        mkdir.mkdirs(dir, err => {\n          if (err) return callback(err)\n          makeLink(srcpath, dstpath)\n        })\n      })\n    })\n  })\n}\n\nfunction createLinkSync (srcpath, dstpath) {\n  const destinationExists = fs.existsSync(dstpath)\n  if (destinationExists) return undefined\n\n  try {\n    fs.lstatSync(srcpath)\n  } catch (err) {\n    err.message = err.message.replace('lstat', 'ensureLink')\n    throw err\n  }\n\n  const dir = path.dirname(dstpath)\n  const dirExists = fs.existsSync(dir)\n  if (dirExists) return fs.linkSync(srcpath, dstpath)\n  mkdir.mkdirsSync(dir)\n\n  return fs.linkSync(srcpath, dstpath)\n}\n\nmodule.exports = {\n  createLink: u(createLink),\n  createLinkSync\n}\n\n\n//# sourceURL=webpack://@pipcook/plugins-bayesian-model-define/./node_modules/fs-extra/lib/ensure/link.js?");

/***/ }),

/***/ "./node_modules/fs-extra/lib/ensure/symlink-paths.js":
/*!***********************************************************!*\
  !*** ./node_modules/fs-extra/lib/ensure/symlink-paths.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nconst path = __webpack_require__(/*! path */ \"path\")\nconst fs = __webpack_require__(/*! graceful-fs */ \"./node_modules/graceful-fs/graceful-fs.js\")\nconst pathExists = __webpack_require__(/*! ../path-exists */ \"./node_modules/fs-extra/lib/path-exists/index.js\").pathExists\n\n/**\n * Function that returns two types of paths, one relative to symlink, and one\n * relative to the current working directory. Checks if path is absolute or\n * relative. If the path is relative, this function checks if the path is\n * relative to symlink or relative to current working directory. This is an\n * initiative to find a smarter `srcpath` to supply when building symlinks.\n * This allows you to determine which path to use out of one of three possible\n * types of source paths. The first is an absolute path. This is detected by\n * `path.isAbsolute()`. When an absolute path is provided, it is checked to\n * see if it exists. If it does it's used, if not an error is returned\n * (callback)/ thrown (sync). The other two options for `srcpath` are a\n * relative url. By default Node's `fs.symlink` works by creating a symlink\n * using `dstpath` and expects the `srcpath` to be relative to the newly\n * created symlink. If you provide a `srcpath` that does not exist on the file\n * system it results in a broken symlink. To minimize this, the function\n * checks to see if the 'relative to symlink' source file exists, and if it\n * does it will use it. If it does not, it checks if there's a file that\n * exists that is relative to the current working directory, if does its used.\n * This preserves the expectations of the original fs.symlink spec and adds\n * the ability to pass in `relative to current working direcotry` paths.\n */\n\nfunction symlinkPaths (srcpath, dstpath, callback) {\n  if (path.isAbsolute(srcpath)) {\n    return fs.lstat(srcpath, (err) => {\n      if (err) {\n        err.message = err.message.replace('lstat', 'ensureSymlink')\n        return callback(err)\n      }\n      return callback(null, {\n        toCwd: srcpath,\n        toDst: srcpath\n      })\n    })\n  } else {\n    const dstdir = path.dirname(dstpath)\n    const relativeToDst = path.join(dstdir, srcpath)\n    return pathExists(relativeToDst, (err, exists) => {\n      if (err) return callback(err)\n      if (exists) {\n        return callback(null, {\n          toCwd: relativeToDst,\n          toDst: srcpath\n        })\n      } else {\n        return fs.lstat(srcpath, (err) => {\n          if (err) {\n            err.message = err.message.replace('lstat', 'ensureSymlink')\n            return callback(err)\n          }\n          return callback(null, {\n            toCwd: srcpath,\n            toDst: path.relative(dstdir, srcpath)\n          })\n        })\n      }\n    })\n  }\n}\n\nfunction symlinkPathsSync (srcpath, dstpath) {\n  let exists\n  if (path.isAbsolute(srcpath)) {\n    exists = fs.existsSync(srcpath)\n    if (!exists) throw new Error('absolute srcpath does not exist')\n    return {\n      toCwd: srcpath,\n      toDst: srcpath\n    }\n  } else {\n    const dstdir = path.dirname(dstpath)\n    const relativeToDst = path.join(dstdir, srcpath)\n    exists = fs.existsSync(relativeToDst)\n    if (exists) {\n      return {\n        toCwd: relativeToDst,\n        toDst: srcpath\n      }\n    } else {\n      exists = fs.existsSync(srcpath)\n      if (!exists) throw new Error('relative srcpath does not exist')\n      return {\n        toCwd: srcpath,\n        toDst: path.relative(dstdir, srcpath)\n      }\n    }\n  }\n}\n\nmodule.exports = {\n  symlinkPaths,\n  symlinkPathsSync\n}\n\n\n//# sourceURL=webpack://@pipcook/plugins-bayesian-model-define/./node_modules/fs-extra/lib/ensure/symlink-paths.js?");

/***/ }),

/***/ "./node_modules/fs-extra/lib/ensure/symlink-type.js":
/*!**********************************************************!*\
  !*** ./node_modules/fs-extra/lib/ensure/symlink-type.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nconst fs = __webpack_require__(/*! graceful-fs */ \"./node_modules/graceful-fs/graceful-fs.js\")\n\nfunction symlinkType (srcpath, type, callback) {\n  callback = (typeof type === 'function') ? type : callback\n  type = (typeof type === 'function') ? false : type\n  if (type) return callback(null, type)\n  fs.lstat(srcpath, (err, stats) => {\n    if (err) return callback(null, 'file')\n    type = (stats && stats.isDirectory()) ? 'dir' : 'file'\n    callback(null, type)\n  })\n}\n\nfunction symlinkTypeSync (srcpath, type) {\n  let stats\n\n  if (type) return type\n  try {\n    stats = fs.lstatSync(srcpath)\n  } catch {\n    return 'file'\n  }\n  return (stats && stats.isDirectory()) ? 'dir' : 'file'\n}\n\nmodule.exports = {\n  symlinkType,\n  symlinkTypeSync\n}\n\n\n//# sourceURL=webpack://@pipcook/plugins-bayesian-model-define/./node_modules/fs-extra/lib/ensure/symlink-type.js?");

/***/ }),

/***/ "./node_modules/fs-extra/lib/ensure/symlink.js":
/*!*****************************************************!*\
  !*** ./node_modules/fs-extra/lib/ensure/symlink.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nconst u = __webpack_require__(/*! universalify */ \"./node_modules/universalify/index.js\").fromCallback\nconst path = __webpack_require__(/*! path */ \"path\")\nconst fs = __webpack_require__(/*! graceful-fs */ \"./node_modules/graceful-fs/graceful-fs.js\")\nconst _mkdirs = __webpack_require__(/*! ../mkdirs */ \"./node_modules/fs-extra/lib/mkdirs/index.js\")\nconst mkdirs = _mkdirs.mkdirs\nconst mkdirsSync = _mkdirs.mkdirsSync\n\nconst _symlinkPaths = __webpack_require__(/*! ./symlink-paths */ \"./node_modules/fs-extra/lib/ensure/symlink-paths.js\")\nconst symlinkPaths = _symlinkPaths.symlinkPaths\nconst symlinkPathsSync = _symlinkPaths.symlinkPathsSync\n\nconst _symlinkType = __webpack_require__(/*! ./symlink-type */ \"./node_modules/fs-extra/lib/ensure/symlink-type.js\")\nconst symlinkType = _symlinkType.symlinkType\nconst symlinkTypeSync = _symlinkType.symlinkTypeSync\n\nconst pathExists = __webpack_require__(/*! ../path-exists */ \"./node_modules/fs-extra/lib/path-exists/index.js\").pathExists\n\nfunction createSymlink (srcpath, dstpath, type, callback) {\n  callback = (typeof type === 'function') ? type : callback\n  type = (typeof type === 'function') ? false : type\n\n  pathExists(dstpath, (err, destinationExists) => {\n    if (err) return callback(err)\n    if (destinationExists) return callback(null)\n    symlinkPaths(srcpath, dstpath, (err, relative) => {\n      if (err) return callback(err)\n      srcpath = relative.toDst\n      symlinkType(relative.toCwd, type, (err, type) => {\n        if (err) return callback(err)\n        const dir = path.dirname(dstpath)\n        pathExists(dir, (err, dirExists) => {\n          if (err) return callback(err)\n          if (dirExists) return fs.symlink(srcpath, dstpath, type, callback)\n          mkdirs(dir, err => {\n            if (err) return callback(err)\n            fs.symlink(srcpath, dstpath, type, callback)\n          })\n        })\n      })\n    })\n  })\n}\n\nfunction createSymlinkSync (srcpath, dstpath, type) {\n  const destinationExists = fs.existsSync(dstpath)\n  if (destinationExists) return undefined\n\n  const relative = symlinkPathsSync(srcpath, dstpath)\n  srcpath = relative.toDst\n  type = symlinkTypeSync(relative.toCwd, type)\n  const dir = path.dirname(dstpath)\n  const exists = fs.existsSync(dir)\n  if (exists) return fs.symlinkSync(srcpath, dstpath, type)\n  mkdirsSync(dir)\n  return fs.symlinkSync(srcpath, dstpath, type)\n}\n\nmodule.exports = {\n  createSymlink: u(createSymlink),\n  createSymlinkSync\n}\n\n\n//# sourceURL=webpack://@pipcook/plugins-bayesian-model-define/./node_modules/fs-extra/lib/ensure/symlink.js?");

/***/ }),

/***/ "./node_modules/fs-extra/lib/fs/index.js":
/*!***********************************************!*\
  !*** ./node_modules/fs-extra/lib/fs/index.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\n// This is adapted from https://github.com/normalize/mz\n// Copyright (c) 2014-2016 Jonathan Ong me@jongleberry.com and Contributors\nconst u = __webpack_require__(/*! universalify */ \"./node_modules/universalify/index.js\").fromCallback\nconst fs = __webpack_require__(/*! graceful-fs */ \"./node_modules/graceful-fs/graceful-fs.js\")\n\nconst api = [\n  'access',\n  'appendFile',\n  'chmod',\n  'chown',\n  'close',\n  'copyFile',\n  'fchmod',\n  'fchown',\n  'fdatasync',\n  'fstat',\n  'fsync',\n  'ftruncate',\n  'futimes',\n  'lchmod',\n  'lchown',\n  'link',\n  'lstat',\n  'mkdir',\n  'mkdtemp',\n  'open',\n  'opendir',\n  'readdir',\n  'readFile',\n  'readlink',\n  'realpath',\n  'rename',\n  'rm',\n  'rmdir',\n  'stat',\n  'symlink',\n  'truncate',\n  'unlink',\n  'utimes',\n  'writeFile'\n].filter(key => {\n  // Some commands are not available on some systems. Ex:\n  // fs.opendir was added in Node.js v12.12.0\n  // fs.rm was added in Node.js v14.14.0\n  // fs.lchown is not available on at least some Linux\n  return typeof fs[key] === 'function'\n})\n\n// Export all keys:\nObject.keys(fs).forEach(key => {\n  if (key === 'promises') {\n    // fs.promises is a getter property that triggers ExperimentalWarning\n    // Don't re-export it here, the getter is defined in \"lib/index.js\"\n    return\n  }\n  exports[key] = fs[key]\n})\n\n// Universalify async methods:\napi.forEach(method => {\n  exports[method] = u(fs[method])\n})\n\n// We differ from mz/fs in that we still ship the old, broken, fs.exists()\n// since we are a drop-in replacement for the native module\nexports.exists = function (filename, callback) {\n  if (typeof callback === 'function') {\n    return fs.exists(filename, callback)\n  }\n  return new Promise(resolve => {\n    return fs.exists(filename, resolve)\n  })\n}\n\n// fs.read(), fs.write(), & fs.writev() need special treatment due to multiple callback args\n\nexports.read = function (fd, buffer, offset, length, position, callback) {\n  if (typeof callback === 'function') {\n    return fs.read(fd, buffer, offset, length, position, callback)\n  }\n  return new Promise((resolve, reject) => {\n    fs.read(fd, buffer, offset, length, position, (err, bytesRead, buffer) => {\n      if (err) return reject(err)\n      resolve({ bytesRead, buffer })\n    })\n  })\n}\n\n// Function signature can be\n// fs.write(fd, buffer[, offset[, length[, position]]], callback)\n// OR\n// fs.write(fd, string[, position[, encoding]], callback)\n// We need to handle both cases, so we use ...args\nexports.write = function (fd, buffer, ...args) {\n  if (typeof args[args.length - 1] === 'function') {\n    return fs.write(fd, buffer, ...args)\n  }\n\n  return new Promise((resolve, reject) => {\n    fs.write(fd, buffer, ...args, (err, bytesWritten, buffer) => {\n      if (err) return reject(err)\n      resolve({ bytesWritten, buffer })\n    })\n  })\n}\n\n// fs.writev only available in Node v12.9.0+\nif (typeof fs.writev === 'function') {\n  // Function signature is\n  // s.writev(fd, buffers[, position], callback)\n  // We need to handle the optional arg, so we use ...args\n  exports.writev = function (fd, buffers, ...args) {\n    if (typeof args[args.length - 1] === 'function') {\n      return fs.writev(fd, buffers, ...args)\n    }\n\n    return new Promise((resolve, reject) => {\n      fs.writev(fd, buffers, ...args, (err, bytesWritten, buffers) => {\n        if (err) return reject(err)\n        resolve({ bytesWritten, buffers })\n      })\n    })\n  }\n}\n\n// fs.realpath.native only available in Node v9.2+\nif (typeof fs.realpath.native === 'function') {\n  exports.realpath.native = u(fs.realpath.native)\n}\n\n\n//# sourceURL=webpack://@pipcook/plugins-bayesian-model-define/./node_modules/fs-extra/lib/fs/index.js?");

/***/ }),

/***/ "./node_modules/fs-extra/lib/index.js":
/*!********************************************!*\
  !*** ./node_modules/fs-extra/lib/index.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nmodule.exports = {\n  // Export promiseified graceful-fs:\n  ...__webpack_require__(/*! ./fs */ \"./node_modules/fs-extra/lib/fs/index.js\"),\n  // Export extra methods:\n  ...__webpack_require__(/*! ./copy-sync */ \"./node_modules/fs-extra/lib/copy-sync/index.js\"),\n  ...__webpack_require__(/*! ./copy */ \"./node_modules/fs-extra/lib/copy/index.js\"),\n  ...__webpack_require__(/*! ./empty */ \"./node_modules/fs-extra/lib/empty/index.js\"),\n  ...__webpack_require__(/*! ./ensure */ \"./node_modules/fs-extra/lib/ensure/index.js\"),\n  ...__webpack_require__(/*! ./json */ \"./node_modules/fs-extra/lib/json/index.js\"),\n  ...__webpack_require__(/*! ./mkdirs */ \"./node_modules/fs-extra/lib/mkdirs/index.js\"),\n  ...__webpack_require__(/*! ./move-sync */ \"./node_modules/fs-extra/lib/move-sync/index.js\"),\n  ...__webpack_require__(/*! ./move */ \"./node_modules/fs-extra/lib/move/index.js\"),\n  ...__webpack_require__(/*! ./output */ \"./node_modules/fs-extra/lib/output/index.js\"),\n  ...__webpack_require__(/*! ./path-exists */ \"./node_modules/fs-extra/lib/path-exists/index.js\"),\n  ...__webpack_require__(/*! ./remove */ \"./node_modules/fs-extra/lib/remove/index.js\")\n}\n\n// Export fs.promises as a getter property so that we don't trigger\n// ExperimentalWarning before fs.promises is actually accessed.\nconst fs = __webpack_require__(/*! fs */ \"fs\")\nif (Object.getOwnPropertyDescriptor(fs, 'promises')) {\n  Object.defineProperty(module.exports, \"promises\", ({\n    get () { return fs.promises }\n  }))\n}\n\n\n//# sourceURL=webpack://@pipcook/plugins-bayesian-model-define/./node_modules/fs-extra/lib/index.js?");

/***/ }),

/***/ "./node_modules/fs-extra/lib/json/index.js":
/*!*************************************************!*\
  !*** ./node_modules/fs-extra/lib/json/index.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nconst u = __webpack_require__(/*! universalify */ \"./node_modules/universalify/index.js\").fromPromise\nconst jsonFile = __webpack_require__(/*! ./jsonfile */ \"./node_modules/fs-extra/lib/json/jsonfile.js\")\n\njsonFile.outputJson = u(__webpack_require__(/*! ./output-json */ \"./node_modules/fs-extra/lib/json/output-json.js\"))\njsonFile.outputJsonSync = __webpack_require__(/*! ./output-json-sync */ \"./node_modules/fs-extra/lib/json/output-json-sync.js\")\n// aliases\njsonFile.outputJSON = jsonFile.outputJson\njsonFile.outputJSONSync = jsonFile.outputJsonSync\njsonFile.writeJSON = jsonFile.writeJson\njsonFile.writeJSONSync = jsonFile.writeJsonSync\njsonFile.readJSON = jsonFile.readJson\njsonFile.readJSONSync = jsonFile.readJsonSync\n\nmodule.exports = jsonFile\n\n\n//# sourceURL=webpack://@pipcook/plugins-bayesian-model-define/./node_modules/fs-extra/lib/json/index.js?");

/***/ }),

/***/ "./node_modules/fs-extra/lib/json/jsonfile.js":
/*!****************************************************!*\
  !*** ./node_modules/fs-extra/lib/json/jsonfile.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nconst jsonFile = __webpack_require__(/*! jsonfile */ \"./node_modules/jsonfile/index.js\")\n\nmodule.exports = {\n  // jsonfile exports\n  readJson: jsonFile.readFile,\n  readJsonSync: jsonFile.readFileSync,\n  writeJson: jsonFile.writeFile,\n  writeJsonSync: jsonFile.writeFileSync\n}\n\n\n//# sourceURL=webpack://@pipcook/plugins-bayesian-model-define/./node_modules/fs-extra/lib/json/jsonfile.js?");

/***/ }),

/***/ "./node_modules/fs-extra/lib/json/output-json-sync.js":
/*!************************************************************!*\
  !*** ./node_modules/fs-extra/lib/json/output-json-sync.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nconst { stringify } = __webpack_require__(/*! jsonfile/utils */ \"./node_modules/jsonfile/utils.js\")\nconst { outputFileSync } = __webpack_require__(/*! ../output */ \"./node_modules/fs-extra/lib/output/index.js\")\n\nfunction outputJsonSync (file, data, options) {\n  const str = stringify(data, options)\n\n  outputFileSync(file, str, options)\n}\n\nmodule.exports = outputJsonSync\n\n\n//# sourceURL=webpack://@pipcook/plugins-bayesian-model-define/./node_modules/fs-extra/lib/json/output-json-sync.js?");

/***/ }),

/***/ "./node_modules/fs-extra/lib/json/output-json.js":
/*!*******************************************************!*\
  !*** ./node_modules/fs-extra/lib/json/output-json.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nconst { stringify } = __webpack_require__(/*! jsonfile/utils */ \"./node_modules/jsonfile/utils.js\")\nconst { outputFile } = __webpack_require__(/*! ../output */ \"./node_modules/fs-extra/lib/output/index.js\")\n\nasync function outputJson (file, data, options = {}) {\n  const str = stringify(data, options)\n\n  await outputFile(file, str, options)\n}\n\nmodule.exports = outputJson\n\n\n//# sourceURL=webpack://@pipcook/plugins-bayesian-model-define/./node_modules/fs-extra/lib/json/output-json.js?");

/***/ }),

/***/ "./node_modules/fs-extra/lib/mkdirs/index.js":
/*!***************************************************!*\
  !*** ./node_modules/fs-extra/lib/mkdirs/index.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\nconst u = __webpack_require__(/*! universalify */ \"./node_modules/universalify/index.js\").fromPromise\nconst { makeDir: _makeDir, makeDirSync } = __webpack_require__(/*! ./make-dir */ \"./node_modules/fs-extra/lib/mkdirs/make-dir.js\")\nconst makeDir = u(_makeDir)\n\nmodule.exports = {\n  mkdirs: makeDir,\n  mkdirsSync: makeDirSync,\n  // alias\n  mkdirp: makeDir,\n  mkdirpSync: makeDirSync,\n  ensureDir: makeDir,\n  ensureDirSync: makeDirSync\n}\n\n\n//# sourceURL=webpack://@pipcook/plugins-bayesian-model-define/./node_modules/fs-extra/lib/mkdirs/index.js?");

/***/ }),

/***/ "./node_modules/fs-extra/lib/mkdirs/make-dir.js":
/*!******************************************************!*\
  !*** ./node_modules/fs-extra/lib/mkdirs/make-dir.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("// Adapted from https://github.com/sindresorhus/make-dir\n// Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)\n// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the \"Software\"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:\n// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.\n// THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n\nconst fs = __webpack_require__(/*! ../fs */ \"./node_modules/fs-extra/lib/fs/index.js\")\nconst path = __webpack_require__(/*! path */ \"path\")\nconst atLeastNode = __webpack_require__(/*! at-least-node */ \"./node_modules/at-least-node/index.js\")\n\nconst useNativeRecursiveOption = atLeastNode('10.12.0')\n\n// https://github.com/nodejs/node/issues/8987\n// https://github.com/libuv/libuv/pull/1088\nconst checkPath = pth => {\n  if (process.platform === 'win32') {\n    const pathHasInvalidWinCharacters = /[<>:\"|?*]/.test(pth.replace(path.parse(pth).root, ''))\n\n    if (pathHasInvalidWinCharacters) {\n      const error = new Error(`Path contains invalid characters: ${pth}`)\n      error.code = 'EINVAL'\n      throw error\n    }\n  }\n}\n\nconst processOptions = options => {\n  const defaults = { mode: 0o777 }\n  if (typeof options === 'number') options = { mode: options }\n  return { ...defaults, ...options }\n}\n\nconst permissionError = pth => {\n  // This replicates the exception of `fs.mkdir` with native the\n  // `recusive` option when run on an invalid drive under Windows.\n  const error = new Error(`operation not permitted, mkdir '${pth}'`)\n  error.code = 'EPERM'\n  error.errno = -4048\n  error.path = pth\n  error.syscall = 'mkdir'\n  return error\n}\n\nmodule.exports.makeDir = async (input, options) => {\n  checkPath(input)\n  options = processOptions(options)\n\n  if (useNativeRecursiveOption) {\n    const pth = path.resolve(input)\n\n    return fs.mkdir(pth, {\n      mode: options.mode,\n      recursive: true\n    })\n  }\n\n  const make = async pth => {\n    try {\n      await fs.mkdir(pth, options.mode)\n    } catch (error) {\n      if (error.code === 'EPERM') {\n        throw error\n      }\n\n      if (error.code === 'ENOENT') {\n        if (path.dirname(pth) === pth) {\n          throw permissionError(pth)\n        }\n\n        if (error.message.includes('null bytes')) {\n          throw error\n        }\n\n        await make(path.dirname(pth))\n        return make(pth)\n      }\n\n      try {\n        const stats = await fs.stat(pth)\n        if (!stats.isDirectory()) {\n          // This error is never exposed to the user\n          // it is caught below, and the original error is thrown\n          throw new Error('The path is not a directory')\n        }\n      } catch {\n        throw error\n      }\n    }\n  }\n\n  return make(path.resolve(input))\n}\n\nmodule.exports.makeDirSync = (input, options) => {\n  checkPath(input)\n  options = processOptions(options)\n\n  if (useNativeRecursiveOption) {\n    const pth = path.resolve(input)\n\n    return fs.mkdirSync(pth, {\n      mode: options.mode,\n      recursive: true\n    })\n  }\n\n  const make = pth => {\n    try {\n      fs.mkdirSync(pth, options.mode)\n    } catch (error) {\n      if (error.code === 'EPERM') {\n        throw error\n      }\n\n      if (error.code === 'ENOENT') {\n        if (path.dirname(pth) === pth) {\n          throw permissionError(pth)\n        }\n\n        if (error.message.includes('null bytes')) {\n          throw error\n        }\n\n        make(path.dirname(pth))\n        return make(pth)\n      }\n\n      try {\n        if (!fs.statSync(pth).isDirectory()) {\n          // This error is never exposed to the user\n          // it is caught below, and the original error is thrown\n          throw new Error('The path is not a directory')\n        }\n      } catch {\n        throw error\n      }\n    }\n  }\n\n  return make(path.resolve(input))\n}\n\n\n//# sourceURL=webpack://@pipcook/plugins-bayesian-model-define/./node_modules/fs-extra/lib/mkdirs/make-dir.js?");

/***/ }),

/***/ "./node_modules/fs-extra/lib/move-sync/index.js":
/*!******************************************************!*\
  !*** ./node_modules/fs-extra/lib/move-sync/index.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nmodule.exports = {\n  moveSync: __webpack_require__(/*! ./move-sync */ \"./node_modules/fs-extra/lib/move-sync/move-sync.js\")\n}\n\n\n//# sourceURL=webpack://@pipcook/plugins-bayesian-model-define/./node_modules/fs-extra/lib/move-sync/index.js?");

/***/ }),

/***/ "./node_modules/fs-extra/lib/move-sync/move-sync.js":
/*!**********************************************************!*\
  !*** ./node_modules/fs-extra/lib/move-sync/move-sync.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nconst fs = __webpack_require__(/*! graceful-fs */ \"./node_modules/graceful-fs/graceful-fs.js\")\nconst path = __webpack_require__(/*! path */ \"path\")\nconst copySync = __webpack_require__(/*! ../copy-sync */ \"./node_modules/fs-extra/lib/copy-sync/index.js\").copySync\nconst removeSync = __webpack_require__(/*! ../remove */ \"./node_modules/fs-extra/lib/remove/index.js\").removeSync\nconst mkdirpSync = __webpack_require__(/*! ../mkdirs */ \"./node_modules/fs-extra/lib/mkdirs/index.js\").mkdirpSync\nconst stat = __webpack_require__(/*! ../util/stat */ \"./node_modules/fs-extra/lib/util/stat.js\")\n\nfunction moveSync (src, dest, opts) {\n  opts = opts || {}\n  const overwrite = opts.overwrite || opts.clobber || false\n\n  const { srcStat } = stat.checkPathsSync(src, dest, 'move')\n  stat.checkParentPathsSync(src, srcStat, dest, 'move')\n  mkdirpSync(path.dirname(dest))\n  return doRename(src, dest, overwrite)\n}\n\nfunction doRename (src, dest, overwrite) {\n  if (overwrite) {\n    removeSync(dest)\n    return rename(src, dest, overwrite)\n  }\n  if (fs.existsSync(dest)) throw new Error('dest already exists.')\n  return rename(src, dest, overwrite)\n}\n\nfunction rename (src, dest, overwrite) {\n  try {\n    fs.renameSync(src, dest)\n  } catch (err) {\n    if (err.code !== 'EXDEV') throw err\n    return moveAcrossDevice(src, dest, overwrite)\n  }\n}\n\nfunction moveAcrossDevice (src, dest, overwrite) {\n  const opts = {\n    overwrite,\n    errorOnExist: true\n  }\n  copySync(src, dest, opts)\n  return removeSync(src)\n}\n\nmodule.exports = moveSync\n\n\n//# sourceURL=webpack://@pipcook/plugins-bayesian-model-define/./node_modules/fs-extra/lib/move-sync/move-sync.js?");

/***/ }),

/***/ "./node_modules/fs-extra/lib/move/index.js":
/*!*************************************************!*\
  !*** ./node_modules/fs-extra/lib/move/index.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nconst u = __webpack_require__(/*! universalify */ \"./node_modules/universalify/index.js\").fromCallback\nmodule.exports = {\n  move: u(__webpack_require__(/*! ./move */ \"./node_modules/fs-extra/lib/move/move.js\"))\n}\n\n\n//# sourceURL=webpack://@pipcook/plugins-bayesian-model-define/./node_modules/fs-extra/lib/move/index.js?");

/***/ }),

/***/ "./node_modules/fs-extra/lib/move/move.js":
/*!************************************************!*\
  !*** ./node_modules/fs-extra/lib/move/move.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nconst fs = __webpack_require__(/*! graceful-fs */ \"./node_modules/graceful-fs/graceful-fs.js\")\nconst path = __webpack_require__(/*! path */ \"path\")\nconst copy = __webpack_require__(/*! ../copy */ \"./node_modules/fs-extra/lib/copy/index.js\").copy\nconst remove = __webpack_require__(/*! ../remove */ \"./node_modules/fs-extra/lib/remove/index.js\").remove\nconst mkdirp = __webpack_require__(/*! ../mkdirs */ \"./node_modules/fs-extra/lib/mkdirs/index.js\").mkdirp\nconst pathExists = __webpack_require__(/*! ../path-exists */ \"./node_modules/fs-extra/lib/path-exists/index.js\").pathExists\nconst stat = __webpack_require__(/*! ../util/stat */ \"./node_modules/fs-extra/lib/util/stat.js\")\n\nfunction move (src, dest, opts, cb) {\n  if (typeof opts === 'function') {\n    cb = opts\n    opts = {}\n  }\n\n  const overwrite = opts.overwrite || opts.clobber || false\n\n  stat.checkPaths(src, dest, 'move', (err, stats) => {\n    if (err) return cb(err)\n    const { srcStat } = stats\n    stat.checkParentPaths(src, srcStat, dest, 'move', err => {\n      if (err) return cb(err)\n      mkdirp(path.dirname(dest), err => {\n        if (err) return cb(err)\n        return doRename(src, dest, overwrite, cb)\n      })\n    })\n  })\n}\n\nfunction doRename (src, dest, overwrite, cb) {\n  if (overwrite) {\n    return remove(dest, err => {\n      if (err) return cb(err)\n      return rename(src, dest, overwrite, cb)\n    })\n  }\n  pathExists(dest, (err, destExists) => {\n    if (err) return cb(err)\n    if (destExists) return cb(new Error('dest already exists.'))\n    return rename(src, dest, overwrite, cb)\n  })\n}\n\nfunction rename (src, dest, overwrite, cb) {\n  fs.rename(src, dest, err => {\n    if (!err) return cb()\n    if (err.code !== 'EXDEV') return cb(err)\n    return moveAcrossDevice(src, dest, overwrite, cb)\n  })\n}\n\nfunction moveAcrossDevice (src, dest, overwrite, cb) {\n  const opts = {\n    overwrite,\n    errorOnExist: true\n  }\n  copy(src, dest, opts, err => {\n    if (err) return cb(err)\n    return remove(src, cb)\n  })\n}\n\nmodule.exports = move\n\n\n//# sourceURL=webpack://@pipcook/plugins-bayesian-model-define/./node_modules/fs-extra/lib/move/move.js?");

/***/ }),

/***/ "./node_modules/fs-extra/lib/output/index.js":
/*!***************************************************!*\
  !*** ./node_modules/fs-extra/lib/output/index.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nconst u = __webpack_require__(/*! universalify */ \"./node_modules/universalify/index.js\").fromCallback\nconst fs = __webpack_require__(/*! graceful-fs */ \"./node_modules/graceful-fs/graceful-fs.js\")\nconst path = __webpack_require__(/*! path */ \"path\")\nconst mkdir = __webpack_require__(/*! ../mkdirs */ \"./node_modules/fs-extra/lib/mkdirs/index.js\")\nconst pathExists = __webpack_require__(/*! ../path-exists */ \"./node_modules/fs-extra/lib/path-exists/index.js\").pathExists\n\nfunction outputFile (file, data, encoding, callback) {\n  if (typeof encoding === 'function') {\n    callback = encoding\n    encoding = 'utf8'\n  }\n\n  const dir = path.dirname(file)\n  pathExists(dir, (err, itDoes) => {\n    if (err) return callback(err)\n    if (itDoes) return fs.writeFile(file, data, encoding, callback)\n\n    mkdir.mkdirs(dir, err => {\n      if (err) return callback(err)\n\n      fs.writeFile(file, data, encoding, callback)\n    })\n  })\n}\n\nfunction outputFileSync (file, ...args) {\n  const dir = path.dirname(file)\n  if (fs.existsSync(dir)) {\n    return fs.writeFileSync(file, ...args)\n  }\n  mkdir.mkdirsSync(dir)\n  fs.writeFileSync(file, ...args)\n}\n\nmodule.exports = {\n  outputFile: u(outputFile),\n  outputFileSync\n}\n\n\n//# sourceURL=webpack://@pipcook/plugins-bayesian-model-define/./node_modules/fs-extra/lib/output/index.js?");

/***/ }),

/***/ "./node_modules/fs-extra/lib/path-exists/index.js":
/*!********************************************************!*\
  !*** ./node_modules/fs-extra/lib/path-exists/index.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\nconst u = __webpack_require__(/*! universalify */ \"./node_modules/universalify/index.js\").fromPromise\nconst fs = __webpack_require__(/*! ../fs */ \"./node_modules/fs-extra/lib/fs/index.js\")\n\nfunction pathExists (path) {\n  return fs.access(path).then(() => true).catch(() => false)\n}\n\nmodule.exports = {\n  pathExists: u(pathExists),\n  pathExistsSync: fs.existsSync\n}\n\n\n//# sourceURL=webpack://@pipcook/plugins-bayesian-model-define/./node_modules/fs-extra/lib/path-exists/index.js?");

/***/ }),

/***/ "./node_modules/fs-extra/lib/remove/index.js":
/*!***************************************************!*\
  !*** ./node_modules/fs-extra/lib/remove/index.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nconst u = __webpack_require__(/*! universalify */ \"./node_modules/universalify/index.js\").fromCallback\nconst rimraf = __webpack_require__(/*! ./rimraf */ \"./node_modules/fs-extra/lib/remove/rimraf.js\")\n\nmodule.exports = {\n  remove: u(rimraf),\n  removeSync: rimraf.sync\n}\n\n\n//# sourceURL=webpack://@pipcook/plugins-bayesian-model-define/./node_modules/fs-extra/lib/remove/index.js?");

/***/ }),

/***/ "./node_modules/fs-extra/lib/remove/rimraf.js":
/*!****************************************************!*\
  !*** ./node_modules/fs-extra/lib/remove/rimraf.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nconst fs = __webpack_require__(/*! graceful-fs */ \"./node_modules/graceful-fs/graceful-fs.js\")\nconst path = __webpack_require__(/*! path */ \"path\")\nconst assert = __webpack_require__(/*! assert */ \"assert\")\n\nconst isWindows = (process.platform === 'win32')\n\nfunction defaults (options) {\n  const methods = [\n    'unlink',\n    'chmod',\n    'stat',\n    'lstat',\n    'rmdir',\n    'readdir'\n  ]\n  methods.forEach(m => {\n    options[m] = options[m] || fs[m]\n    m = m + 'Sync'\n    options[m] = options[m] || fs[m]\n  })\n\n  options.maxBusyTries = options.maxBusyTries || 3\n}\n\nfunction rimraf (p, options, cb) {\n  let busyTries = 0\n\n  if (typeof options === 'function') {\n    cb = options\n    options = {}\n  }\n\n  assert(p, 'rimraf: missing path')\n  assert.strictEqual(typeof p, 'string', 'rimraf: path should be a string')\n  assert.strictEqual(typeof cb, 'function', 'rimraf: callback function required')\n  assert(options, 'rimraf: invalid options argument provided')\n  assert.strictEqual(typeof options, 'object', 'rimraf: options should be object')\n\n  defaults(options)\n\n  rimraf_(p, options, function CB (er) {\n    if (er) {\n      if ((er.code === 'EBUSY' || er.code === 'ENOTEMPTY' || er.code === 'EPERM') &&\n          busyTries < options.maxBusyTries) {\n        busyTries++\n        const time = busyTries * 100\n        // try again, with the same exact callback as this one.\n        return setTimeout(() => rimraf_(p, options, CB), time)\n      }\n\n      // already gone\n      if (er.code === 'ENOENT') er = null\n    }\n\n    cb(er)\n  })\n}\n\n// Two possible strategies.\n// 1. Assume it's a file.  unlink it, then do the dir stuff on EPERM or EISDIR\n// 2. Assume it's a directory.  readdir, then do the file stuff on ENOTDIR\n//\n// Both result in an extra syscall when you guess wrong.  However, there\n// are likely far more normal files in the world than directories.  This\n// is based on the assumption that a the average number of files per\n// directory is >= 1.\n//\n// If anyone ever complains about this, then I guess the strategy could\n// be made configurable somehow.  But until then, YAGNI.\nfunction rimraf_ (p, options, cb) {\n  assert(p)\n  assert(options)\n  assert(typeof cb === 'function')\n\n  // sunos lets the root user unlink directories, which is... weird.\n  // so we have to lstat here and make sure it's not a dir.\n  options.lstat(p, (er, st) => {\n    if (er && er.code === 'ENOENT') {\n      return cb(null)\n    }\n\n    // Windows can EPERM on stat.  Life is suffering.\n    if (er && er.code === 'EPERM' && isWindows) {\n      return fixWinEPERM(p, options, er, cb)\n    }\n\n    if (st && st.isDirectory()) {\n      return rmdir(p, options, er, cb)\n    }\n\n    options.unlink(p, er => {\n      if (er) {\n        if (er.code === 'ENOENT') {\n          return cb(null)\n        }\n        if (er.code === 'EPERM') {\n          return (isWindows)\n            ? fixWinEPERM(p, options, er, cb)\n            : rmdir(p, options, er, cb)\n        }\n        if (er.code === 'EISDIR') {\n          return rmdir(p, options, er, cb)\n        }\n      }\n      return cb(er)\n    })\n  })\n}\n\nfunction fixWinEPERM (p, options, er, cb) {\n  assert(p)\n  assert(options)\n  assert(typeof cb === 'function')\n\n  options.chmod(p, 0o666, er2 => {\n    if (er2) {\n      cb(er2.code === 'ENOENT' ? null : er)\n    } else {\n      options.stat(p, (er3, stats) => {\n        if (er3) {\n          cb(er3.code === 'ENOENT' ? null : er)\n        } else if (stats.isDirectory()) {\n          rmdir(p, options, er, cb)\n        } else {\n          options.unlink(p, cb)\n        }\n      })\n    }\n  })\n}\n\nfunction fixWinEPERMSync (p, options, er) {\n  let stats\n\n  assert(p)\n  assert(options)\n\n  try {\n    options.chmodSync(p, 0o666)\n  } catch (er2) {\n    if (er2.code === 'ENOENT') {\n      return\n    } else {\n      throw er\n    }\n  }\n\n  try {\n    stats = options.statSync(p)\n  } catch (er3) {\n    if (er3.code === 'ENOENT') {\n      return\n    } else {\n      throw er\n    }\n  }\n\n  if (stats.isDirectory()) {\n    rmdirSync(p, options, er)\n  } else {\n    options.unlinkSync(p)\n  }\n}\n\nfunction rmdir (p, options, originalEr, cb) {\n  assert(p)\n  assert(options)\n  assert(typeof cb === 'function')\n\n  // try to rmdir first, and only readdir on ENOTEMPTY or EEXIST (SunOS)\n  // if we guessed wrong, and it's not a directory, then\n  // raise the original error.\n  options.rmdir(p, er => {\n    if (er && (er.code === 'ENOTEMPTY' || er.code === 'EEXIST' || er.code === 'EPERM')) {\n      rmkids(p, options, cb)\n    } else if (er && er.code === 'ENOTDIR') {\n      cb(originalEr)\n    } else {\n      cb(er)\n    }\n  })\n}\n\nfunction rmkids (p, options, cb) {\n  assert(p)\n  assert(options)\n  assert(typeof cb === 'function')\n\n  options.readdir(p, (er, files) => {\n    if (er) return cb(er)\n\n    let n = files.length\n    let errState\n\n    if (n === 0) return options.rmdir(p, cb)\n\n    files.forEach(f => {\n      rimraf(path.join(p, f), options, er => {\n        if (errState) {\n          return\n        }\n        if (er) return cb(errState = er)\n        if (--n === 0) {\n          options.rmdir(p, cb)\n        }\n      })\n    })\n  })\n}\n\n// this looks simpler, and is strictly *faster*, but will\n// tie up the JavaScript thread and fail on excessively\n// deep directory trees.\nfunction rimrafSync (p, options) {\n  let st\n\n  options = options || {}\n  defaults(options)\n\n  assert(p, 'rimraf: missing path')\n  assert.strictEqual(typeof p, 'string', 'rimraf: path should be a string')\n  assert(options, 'rimraf: missing options')\n  assert.strictEqual(typeof options, 'object', 'rimraf: options should be object')\n\n  try {\n    st = options.lstatSync(p)\n  } catch (er) {\n    if (er.code === 'ENOENT') {\n      return\n    }\n\n    // Windows can EPERM on stat.  Life is suffering.\n    if (er.code === 'EPERM' && isWindows) {\n      fixWinEPERMSync(p, options, er)\n    }\n  }\n\n  try {\n    // sunos lets the root user unlink directories, which is... weird.\n    if (st && st.isDirectory()) {\n      rmdirSync(p, options, null)\n    } else {\n      options.unlinkSync(p)\n    }\n  } catch (er) {\n    if (er.code === 'ENOENT') {\n      return\n    } else if (er.code === 'EPERM') {\n      return isWindows ? fixWinEPERMSync(p, options, er) : rmdirSync(p, options, er)\n    } else if (er.code !== 'EISDIR') {\n      throw er\n    }\n    rmdirSync(p, options, er)\n  }\n}\n\nfunction rmdirSync (p, options, originalEr) {\n  assert(p)\n  assert(options)\n\n  try {\n    options.rmdirSync(p)\n  } catch (er) {\n    if (er.code === 'ENOTDIR') {\n      throw originalEr\n    } else if (er.code === 'ENOTEMPTY' || er.code === 'EEXIST' || er.code === 'EPERM') {\n      rmkidsSync(p, options)\n    } else if (er.code !== 'ENOENT') {\n      throw er\n    }\n  }\n}\n\nfunction rmkidsSync (p, options) {\n  assert(p)\n  assert(options)\n  options.readdirSync(p).forEach(f => rimrafSync(path.join(p, f), options))\n\n  if (isWindows) {\n    // We only end up here once we got ENOTEMPTY at least once, and\n    // at this point, we are guaranteed to have removed all the kids.\n    // So, we know that it won't be ENOENT or ENOTDIR or anything else.\n    // try really hard to delete stuff on windows, because it has a\n    // PROFOUNDLY annoying habit of not closing handles promptly when\n    // files are deleted, resulting in spurious ENOTEMPTY errors.\n    const startTime = Date.now()\n    do {\n      try {\n        const ret = options.rmdirSync(p, options)\n        return ret\n      } catch {}\n    } while (Date.now() - startTime < 500) // give up after 500ms\n  } else {\n    const ret = options.rmdirSync(p, options)\n    return ret\n  }\n}\n\nmodule.exports = rimraf\nrimraf.sync = rimrafSync\n\n\n//# sourceURL=webpack://@pipcook/plugins-bayesian-model-define/./node_modules/fs-extra/lib/remove/rimraf.js?");

/***/ }),

/***/ "./node_modules/fs-extra/lib/util/stat.js":
/*!************************************************!*\
  !*** ./node_modules/fs-extra/lib/util/stat.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nconst fs = __webpack_require__(/*! ../fs */ \"./node_modules/fs-extra/lib/fs/index.js\")\nconst path = __webpack_require__(/*! path */ \"path\")\nconst util = __webpack_require__(/*! util */ \"util\")\nconst atLeastNode = __webpack_require__(/*! at-least-node */ \"./node_modules/at-least-node/index.js\")\n\nconst nodeSupportsBigInt = atLeastNode('10.5.0')\nconst stat = (file) => nodeSupportsBigInt ? fs.stat(file, { bigint: true }) : fs.stat(file)\nconst statSync = (file) => nodeSupportsBigInt ? fs.statSync(file, { bigint: true }) : fs.statSync(file)\n\nfunction getStats (src, dest) {\n  return Promise.all([\n    stat(src),\n    stat(dest).catch(err => {\n      if (err.code === 'ENOENT') return null\n      throw err\n    })\n  ]).then(([srcStat, destStat]) => ({ srcStat, destStat }))\n}\n\nfunction getStatsSync (src, dest) {\n  let destStat\n  const srcStat = statSync(src)\n  try {\n    destStat = statSync(dest)\n  } catch (err) {\n    if (err.code === 'ENOENT') return { srcStat, destStat: null }\n    throw err\n  }\n  return { srcStat, destStat }\n}\n\nfunction checkPaths (src, dest, funcName, cb) {\n  util.callbackify(getStats)(src, dest, (err, stats) => {\n    if (err) return cb(err)\n    const { srcStat, destStat } = stats\n    if (destStat && areIdentical(srcStat, destStat)) {\n      return cb(new Error('Source and destination must not be the same.'))\n    }\n    if (srcStat.isDirectory() && isSrcSubdir(src, dest)) {\n      return cb(new Error(errMsg(src, dest, funcName)))\n    }\n    return cb(null, { srcStat, destStat })\n  })\n}\n\nfunction checkPathsSync (src, dest, funcName) {\n  const { srcStat, destStat } = getStatsSync(src, dest)\n  if (destStat && areIdentical(srcStat, destStat)) {\n    throw new Error('Source and destination must not be the same.')\n  }\n  if (srcStat.isDirectory() && isSrcSubdir(src, dest)) {\n    throw new Error(errMsg(src, dest, funcName))\n  }\n  return { srcStat, destStat }\n}\n\n// recursively check if dest parent is a subdirectory of src.\n// It works for all file types including symlinks since it\n// checks the src and dest inodes. It starts from the deepest\n// parent and stops once it reaches the src parent or the root path.\nfunction checkParentPaths (src, srcStat, dest, funcName, cb) {\n  const srcParent = path.resolve(path.dirname(src))\n  const destParent = path.resolve(path.dirname(dest))\n  if (destParent === srcParent || destParent === path.parse(destParent).root) return cb()\n  const callback = (err, destStat) => {\n    if (err) {\n      if (err.code === 'ENOENT') return cb()\n      return cb(err)\n    }\n    if (areIdentical(srcStat, destStat)) {\n      return cb(new Error(errMsg(src, dest, funcName)))\n    }\n    return checkParentPaths(src, srcStat, destParent, funcName, cb)\n  }\n  if (nodeSupportsBigInt) fs.stat(destParent, { bigint: true }, callback)\n  else fs.stat(destParent, callback)\n}\n\nfunction checkParentPathsSync (src, srcStat, dest, funcName) {\n  const srcParent = path.resolve(path.dirname(src))\n  const destParent = path.resolve(path.dirname(dest))\n  if (destParent === srcParent || destParent === path.parse(destParent).root) return\n  let destStat\n  try {\n    destStat = statSync(destParent)\n  } catch (err) {\n    if (err.code === 'ENOENT') return\n    throw err\n  }\n  if (areIdentical(srcStat, destStat)) {\n    throw new Error(errMsg(src, dest, funcName))\n  }\n  return checkParentPathsSync(src, srcStat, destParent, funcName)\n}\n\nfunction areIdentical (srcStat, destStat) {\n  if (destStat.ino && destStat.dev && destStat.ino === srcStat.ino && destStat.dev === srcStat.dev) {\n    if (nodeSupportsBigInt || destStat.ino < Number.MAX_SAFE_INTEGER) {\n      // definitive answer\n      return true\n    }\n    // Use additional heuristics if we can't use 'bigint'.\n    // Different 'ino' could be represented the same if they are >= Number.MAX_SAFE_INTEGER\n    // See issue 657\n    if (destStat.size === srcStat.size &&\n        destStat.mode === srcStat.mode &&\n        destStat.nlink === srcStat.nlink &&\n        destStat.atimeMs === srcStat.atimeMs &&\n        destStat.mtimeMs === srcStat.mtimeMs &&\n        destStat.ctimeMs === srcStat.ctimeMs &&\n        destStat.birthtimeMs === srcStat.birthtimeMs) {\n      // heuristic answer\n      return true\n    }\n  }\n  return false\n}\n\n// return true if dest is a subdir of src, otherwise false.\n// It only checks the path strings.\nfunction isSrcSubdir (src, dest) {\n  const srcArr = path.resolve(src).split(path.sep).filter(i => i)\n  const destArr = path.resolve(dest).split(path.sep).filter(i => i)\n  return srcArr.reduce((acc, cur, i) => acc && destArr[i] === cur, true)\n}\n\nfunction errMsg (src, dest, funcName) {\n  return `Cannot ${funcName} '${src}' to a subdirectory of itself, '${dest}'.`\n}\n\nmodule.exports = {\n  checkPaths,\n  checkPathsSync,\n  checkParentPaths,\n  checkParentPathsSync,\n  isSrcSubdir\n}\n\n\n//# sourceURL=webpack://@pipcook/plugins-bayesian-model-define/./node_modules/fs-extra/lib/util/stat.js?");

/***/ }),

/***/ "./node_modules/fs-extra/lib/util/utimes.js":
/*!**************************************************!*\
  !*** ./node_modules/fs-extra/lib/util/utimes.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nconst fs = __webpack_require__(/*! graceful-fs */ \"./node_modules/graceful-fs/graceful-fs.js\")\n\nfunction utimesMillis (path, atime, mtime, callback) {\n  // if (!HAS_MILLIS_RES) return fs.utimes(path, atime, mtime, callback)\n  fs.open(path, 'r+', (err, fd) => {\n    if (err) return callback(err)\n    fs.futimes(fd, atime, mtime, futimesErr => {\n      fs.close(fd, closeErr => {\n        if (callback) callback(futimesErr || closeErr)\n      })\n    })\n  })\n}\n\nfunction utimesMillisSync (path, atime, mtime) {\n  const fd = fs.openSync(path, 'r+')\n  fs.futimesSync(fd, atime, mtime)\n  return fs.closeSync(fd)\n}\n\nmodule.exports = {\n  utimesMillis,\n  utimesMillisSync\n}\n\n\n//# sourceURL=webpack://@pipcook/plugins-bayesian-model-define/./node_modules/fs-extra/lib/util/utimes.js?");

/***/ }),

/***/ "./node_modules/graceful-fs/clone.js":
/*!*******************************************!*\
  !*** ./node_modules/graceful-fs/clone.js ***!
  \*******************************************/
/***/ ((module) => {

"use strict";
eval("\n\nmodule.exports = clone\n\nvar getPrototypeOf = Object.getPrototypeOf || function (obj) {\n  return obj.__proto__\n}\n\nfunction clone (obj) {\n  if (obj === null || typeof obj !== 'object')\n    return obj\n\n  if (obj instanceof Object)\n    var copy = { __proto__: getPrototypeOf(obj) }\n  else\n    var copy = Object.create(null)\n\n  Object.getOwnPropertyNames(obj).forEach(function (key) {\n    Object.defineProperty(copy, key, Object.getOwnPropertyDescriptor(obj, key))\n  })\n\n  return copy\n}\n\n\n//# sourceURL=webpack://@pipcook/plugins-bayesian-model-define/./node_modules/graceful-fs/clone.js?");

/***/ }),

/***/ "./node_modules/graceful-fs/graceful-fs.js":
/*!*************************************************!*\
  !*** ./node_modules/graceful-fs/graceful-fs.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var fs = __webpack_require__(/*! fs */ \"fs\")\nvar polyfills = __webpack_require__(/*! ./polyfills.js */ \"./node_modules/graceful-fs/polyfills.js\")\nvar legacy = __webpack_require__(/*! ./legacy-streams.js */ \"./node_modules/graceful-fs/legacy-streams.js\")\nvar clone = __webpack_require__(/*! ./clone.js */ \"./node_modules/graceful-fs/clone.js\")\n\nvar util = __webpack_require__(/*! util */ \"util\")\n\n/* istanbul ignore next - node 0.x polyfill */\nvar gracefulQueue\nvar previousSymbol\n\n/* istanbul ignore else - node 0.x polyfill */\nif (typeof Symbol === 'function' && typeof Symbol.for === 'function') {\n  gracefulQueue = Symbol.for('graceful-fs.queue')\n  // This is used in testing by future versions\n  previousSymbol = Symbol.for('graceful-fs.previous')\n} else {\n  gracefulQueue = '___graceful-fs.queue'\n  previousSymbol = '___graceful-fs.previous'\n}\n\nfunction noop () {}\n\nfunction publishQueue(context, queue) {\n  Object.defineProperty(context, gracefulQueue, {\n    get: function() {\n      return queue\n    }\n  })\n}\n\nvar debug = noop\nif (util.debuglog)\n  debug = util.debuglog('gfs4')\nelse if (/\\bgfs4\\b/i.test(process.env.NODE_DEBUG || ''))\n  debug = function() {\n    var m = util.format.apply(util, arguments)\n    m = 'GFS4: ' + m.split(/\\n/).join('\\nGFS4: ')\n    console.error(m)\n  }\n\n// Once time initialization\nif (!fs[gracefulQueue]) {\n  // This queue can be shared by multiple loaded instances\n  var queue = global[gracefulQueue] || []\n  publishQueue(fs, queue)\n\n  // Patch fs.close/closeSync to shared queue version, because we need\n  // to retry() whenever a close happens *anywhere* in the program.\n  // This is essential when multiple graceful-fs instances are\n  // in play at the same time.\n  fs.close = (function (fs$close) {\n    function close (fd, cb) {\n      return fs$close.call(fs, fd, function (err) {\n        // This function uses the graceful-fs shared queue\n        if (!err) {\n          retry()\n        }\n\n        if (typeof cb === 'function')\n          cb.apply(this, arguments)\n      })\n    }\n\n    Object.defineProperty(close, previousSymbol, {\n      value: fs$close\n    })\n    return close\n  })(fs.close)\n\n  fs.closeSync = (function (fs$closeSync) {\n    function closeSync (fd) {\n      // This function uses the graceful-fs shared queue\n      fs$closeSync.apply(fs, arguments)\n      retry()\n    }\n\n    Object.defineProperty(closeSync, previousSymbol, {\n      value: fs$closeSync\n    })\n    return closeSync\n  })(fs.closeSync)\n\n  if (/\\bgfs4\\b/i.test(process.env.NODE_DEBUG || '')) {\n    process.on('exit', function() {\n      debug(fs[gracefulQueue])\n      __webpack_require__(/*! assert */ \"assert\").equal(fs[gracefulQueue].length, 0)\n    })\n  }\n}\n\nif (!global[gracefulQueue]) {\n  publishQueue(global, fs[gracefulQueue]);\n}\n\nmodule.exports = patch(clone(fs))\nif (process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !fs.__patched) {\n    module.exports = patch(fs)\n    fs.__patched = true;\n}\n\nfunction patch (fs) {\n  // Everything that references the open() function needs to be in here\n  polyfills(fs)\n  fs.gracefulify = patch\n\n  fs.createReadStream = createReadStream\n  fs.createWriteStream = createWriteStream\n  var fs$readFile = fs.readFile\n  fs.readFile = readFile\n  function readFile (path, options, cb) {\n    if (typeof options === 'function')\n      cb = options, options = null\n\n    return go$readFile(path, options, cb)\n\n    function go$readFile (path, options, cb) {\n      return fs$readFile(path, options, function (err) {\n        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))\n          enqueue([go$readFile, [path, options, cb]])\n        else {\n          if (typeof cb === 'function')\n            cb.apply(this, arguments)\n          retry()\n        }\n      })\n    }\n  }\n\n  var fs$writeFile = fs.writeFile\n  fs.writeFile = writeFile\n  function writeFile (path, data, options, cb) {\n    if (typeof options === 'function')\n      cb = options, options = null\n\n    return go$writeFile(path, data, options, cb)\n\n    function go$writeFile (path, data, options, cb) {\n      return fs$writeFile(path, data, options, function (err) {\n        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))\n          enqueue([go$writeFile, [path, data, options, cb]])\n        else {\n          if (typeof cb === 'function')\n            cb.apply(this, arguments)\n          retry()\n        }\n      })\n    }\n  }\n\n  var fs$appendFile = fs.appendFile\n  if (fs$appendFile)\n    fs.appendFile = appendFile\n  function appendFile (path, data, options, cb) {\n    if (typeof options === 'function')\n      cb = options, options = null\n\n    return go$appendFile(path, data, options, cb)\n\n    function go$appendFile (path, data, options, cb) {\n      return fs$appendFile(path, data, options, function (err) {\n        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))\n          enqueue([go$appendFile, [path, data, options, cb]])\n        else {\n          if (typeof cb === 'function')\n            cb.apply(this, arguments)\n          retry()\n        }\n      })\n    }\n  }\n\n  var fs$copyFile = fs.copyFile\n  if (fs$copyFile)\n    fs.copyFile = copyFile\n  function copyFile (src, dest, flags, cb) {\n    if (typeof flags === 'function') {\n      cb = flags\n      flags = 0\n    }\n    return fs$copyFile(src, dest, flags, function (err) {\n      if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))\n        enqueue([fs$copyFile, [src, dest, flags, cb]])\n      else {\n        if (typeof cb === 'function')\n          cb.apply(this, arguments)\n        retry()\n      }\n    })\n  }\n\n  var fs$readdir = fs.readdir\n  fs.readdir = readdir\n  function readdir (path, options, cb) {\n    var args = [path]\n    if (typeof options !== 'function') {\n      args.push(options)\n    } else {\n      cb = options\n    }\n    args.push(go$readdir$cb)\n\n    return go$readdir(args)\n\n    function go$readdir$cb (err, files) {\n      if (files && files.sort)\n        files.sort()\n\n      if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))\n        enqueue([go$readdir, [args]])\n\n      else {\n        if (typeof cb === 'function')\n          cb.apply(this, arguments)\n        retry()\n      }\n    }\n  }\n\n  function go$readdir (args) {\n    return fs$readdir.apply(fs, args)\n  }\n\n  if (process.version.substr(0, 4) === 'v0.8') {\n    var legStreams = legacy(fs)\n    ReadStream = legStreams.ReadStream\n    WriteStream = legStreams.WriteStream\n  }\n\n  var fs$ReadStream = fs.ReadStream\n  if (fs$ReadStream) {\n    ReadStream.prototype = Object.create(fs$ReadStream.prototype)\n    ReadStream.prototype.open = ReadStream$open\n  }\n\n  var fs$WriteStream = fs.WriteStream\n  if (fs$WriteStream) {\n    WriteStream.prototype = Object.create(fs$WriteStream.prototype)\n    WriteStream.prototype.open = WriteStream$open\n  }\n\n  Object.defineProperty(fs, 'ReadStream', {\n    get: function () {\n      return ReadStream\n    },\n    set: function (val) {\n      ReadStream = val\n    },\n    enumerable: true,\n    configurable: true\n  })\n  Object.defineProperty(fs, 'WriteStream', {\n    get: function () {\n      return WriteStream\n    },\n    set: function (val) {\n      WriteStream = val\n    },\n    enumerable: true,\n    configurable: true\n  })\n\n  // legacy names\n  var FileReadStream = ReadStream\n  Object.defineProperty(fs, 'FileReadStream', {\n    get: function () {\n      return FileReadStream\n    },\n    set: function (val) {\n      FileReadStream = val\n    },\n    enumerable: true,\n    configurable: true\n  })\n  var FileWriteStream = WriteStream\n  Object.defineProperty(fs, 'FileWriteStream', {\n    get: function () {\n      return FileWriteStream\n    },\n    set: function (val) {\n      FileWriteStream = val\n    },\n    enumerable: true,\n    configurable: true\n  })\n\n  function ReadStream (path, options) {\n    if (this instanceof ReadStream)\n      return fs$ReadStream.apply(this, arguments), this\n    else\n      return ReadStream.apply(Object.create(ReadStream.prototype), arguments)\n  }\n\n  function ReadStream$open () {\n    var that = this\n    open(that.path, that.flags, that.mode, function (err, fd) {\n      if (err) {\n        if (that.autoClose)\n          that.destroy()\n\n        that.emit('error', err)\n      } else {\n        that.fd = fd\n        that.emit('open', fd)\n        that.read()\n      }\n    })\n  }\n\n  function WriteStream (path, options) {\n    if (this instanceof WriteStream)\n      return fs$WriteStream.apply(this, arguments), this\n    else\n      return WriteStream.apply(Object.create(WriteStream.prototype), arguments)\n  }\n\n  function WriteStream$open () {\n    var that = this\n    open(that.path, that.flags, that.mode, function (err, fd) {\n      if (err) {\n        that.destroy()\n        that.emit('error', err)\n      } else {\n        that.fd = fd\n        that.emit('open', fd)\n      }\n    })\n  }\n\n  function createReadStream (path, options) {\n    return new fs.ReadStream(path, options)\n  }\n\n  function createWriteStream (path, options) {\n    return new fs.WriteStream(path, options)\n  }\n\n  var fs$open = fs.open\n  fs.open = open\n  function open (path, flags, mode, cb) {\n    if (typeof mode === 'function')\n      cb = mode, mode = null\n\n    return go$open(path, flags, mode, cb)\n\n    function go$open (path, flags, mode, cb) {\n      return fs$open(path, flags, mode, function (err, fd) {\n        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))\n          enqueue([go$open, [path, flags, mode, cb]])\n        else {\n          if (typeof cb === 'function')\n            cb.apply(this, arguments)\n          retry()\n        }\n      })\n    }\n  }\n\n  return fs\n}\n\nfunction enqueue (elem) {\n  debug('ENQUEUE', elem[0].name, elem[1])\n  fs[gracefulQueue].push(elem)\n}\n\nfunction retry () {\n  var elem = fs[gracefulQueue].shift()\n  if (elem) {\n    debug('RETRY', elem[0].name, elem[1])\n    elem[0].apply(null, elem[1])\n  }\n}\n\n\n//# sourceURL=webpack://@pipcook/plugins-bayesian-model-define/./node_modules/graceful-fs/graceful-fs.js?");

/***/ }),

/***/ "./node_modules/graceful-fs/legacy-streams.js":
/*!****************************************************!*\
  !*** ./node_modules/graceful-fs/legacy-streams.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var Stream = __webpack_require__(/*! stream */ \"stream\").Stream\n\nmodule.exports = legacy\n\nfunction legacy (fs) {\n  return {\n    ReadStream: ReadStream,\n    WriteStream: WriteStream\n  }\n\n  function ReadStream (path, options) {\n    if (!(this instanceof ReadStream)) return new ReadStream(path, options);\n\n    Stream.call(this);\n\n    var self = this;\n\n    this.path = path;\n    this.fd = null;\n    this.readable = true;\n    this.paused = false;\n\n    this.flags = 'r';\n    this.mode = 438; /*=0666*/\n    this.bufferSize = 64 * 1024;\n\n    options = options || {};\n\n    // Mixin options into this\n    var keys = Object.keys(options);\n    for (var index = 0, length = keys.length; index < length; index++) {\n      var key = keys[index];\n      this[key] = options[key];\n    }\n\n    if (this.encoding) this.setEncoding(this.encoding);\n\n    if (this.start !== undefined) {\n      if ('number' !== typeof this.start) {\n        throw TypeError('start must be a Number');\n      }\n      if (this.end === undefined) {\n        this.end = Infinity;\n      } else if ('number' !== typeof this.end) {\n        throw TypeError('end must be a Number');\n      }\n\n      if (this.start > this.end) {\n        throw new Error('start must be <= end');\n      }\n\n      this.pos = this.start;\n    }\n\n    if (this.fd !== null) {\n      process.nextTick(function() {\n        self._read();\n      });\n      return;\n    }\n\n    fs.open(this.path, this.flags, this.mode, function (err, fd) {\n      if (err) {\n        self.emit('error', err);\n        self.readable = false;\n        return;\n      }\n\n      self.fd = fd;\n      self.emit('open', fd);\n      self._read();\n    })\n  }\n\n  function WriteStream (path, options) {\n    if (!(this instanceof WriteStream)) return new WriteStream(path, options);\n\n    Stream.call(this);\n\n    this.path = path;\n    this.fd = null;\n    this.writable = true;\n\n    this.flags = 'w';\n    this.encoding = 'binary';\n    this.mode = 438; /*=0666*/\n    this.bytesWritten = 0;\n\n    options = options || {};\n\n    // Mixin options into this\n    var keys = Object.keys(options);\n    for (var index = 0, length = keys.length; index < length; index++) {\n      var key = keys[index];\n      this[key] = options[key];\n    }\n\n    if (this.start !== undefined) {\n      if ('number' !== typeof this.start) {\n        throw TypeError('start must be a Number');\n      }\n      if (this.start < 0) {\n        throw new Error('start must be >= zero');\n      }\n\n      this.pos = this.start;\n    }\n\n    this.busy = false;\n    this._queue = [];\n\n    if (this.fd === null) {\n      this._open = fs.open;\n      this._queue.push([this._open, this.path, this.flags, this.mode, undefined]);\n      this.flush();\n    }\n  }\n}\n\n\n//# sourceURL=webpack://@pipcook/plugins-bayesian-model-define/./node_modules/graceful-fs/legacy-streams.js?");

/***/ }),

/***/ "./node_modules/graceful-fs/polyfills.js":
/*!***********************************************!*\
  !*** ./node_modules/graceful-fs/polyfills.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var constants = __webpack_require__(/*! constants */ \"constants\")\n\nvar origCwd = process.cwd\nvar cwd = null\n\nvar platform = process.env.GRACEFUL_FS_PLATFORM || process.platform\n\nprocess.cwd = function() {\n  if (!cwd)\n    cwd = origCwd.call(process)\n  return cwd\n}\ntry {\n  process.cwd()\n} catch (er) {}\n\n// This check is needed until node.js 12 is required\nif (typeof process.chdir === 'function') {\n  var chdir = process.chdir\n  process.chdir = function (d) {\n    cwd = null\n    chdir.call(process, d)\n  }\n  if (Object.setPrototypeOf) Object.setPrototypeOf(process.chdir, chdir)\n}\n\nmodule.exports = patch\n\nfunction patch (fs) {\n  // (re-)implement some things that are known busted or missing.\n\n  // lchmod, broken prior to 0.6.2\n  // back-port the fix here.\n  if (constants.hasOwnProperty('O_SYMLINK') &&\n      process.version.match(/^v0\\.6\\.[0-2]|^v0\\.5\\./)) {\n    patchLchmod(fs)\n  }\n\n  // lutimes implementation, or no-op\n  if (!fs.lutimes) {\n    patchLutimes(fs)\n  }\n\n  // https://github.com/isaacs/node-graceful-fs/issues/4\n  // Chown should not fail on einval or eperm if non-root.\n  // It should not fail on enosys ever, as this just indicates\n  // that a fs doesn't support the intended operation.\n\n  fs.chown = chownFix(fs.chown)\n  fs.fchown = chownFix(fs.fchown)\n  fs.lchown = chownFix(fs.lchown)\n\n  fs.chmod = chmodFix(fs.chmod)\n  fs.fchmod = chmodFix(fs.fchmod)\n  fs.lchmod = chmodFix(fs.lchmod)\n\n  fs.chownSync = chownFixSync(fs.chownSync)\n  fs.fchownSync = chownFixSync(fs.fchownSync)\n  fs.lchownSync = chownFixSync(fs.lchownSync)\n\n  fs.chmodSync = chmodFixSync(fs.chmodSync)\n  fs.fchmodSync = chmodFixSync(fs.fchmodSync)\n  fs.lchmodSync = chmodFixSync(fs.lchmodSync)\n\n  fs.stat = statFix(fs.stat)\n  fs.fstat = statFix(fs.fstat)\n  fs.lstat = statFix(fs.lstat)\n\n  fs.statSync = statFixSync(fs.statSync)\n  fs.fstatSync = statFixSync(fs.fstatSync)\n  fs.lstatSync = statFixSync(fs.lstatSync)\n\n  // if lchmod/lchown do not exist, then make them no-ops\n  if (!fs.lchmod) {\n    fs.lchmod = function (path, mode, cb) {\n      if (cb) process.nextTick(cb)\n    }\n    fs.lchmodSync = function () {}\n  }\n  if (!fs.lchown) {\n    fs.lchown = function (path, uid, gid, cb) {\n      if (cb) process.nextTick(cb)\n    }\n    fs.lchownSync = function () {}\n  }\n\n  // on Windows, A/V software can lock the directory, causing this\n  // to fail with an EACCES or EPERM if the directory contains newly\n  // created files.  Try again on failure, for up to 60 seconds.\n\n  // Set the timeout this long because some Windows Anti-Virus, such as Parity\n  // bit9, may lock files for up to a minute, causing npm package install\n  // failures. Also, take care to yield the scheduler. Windows scheduling gives\n  // CPU to a busy looping process, which can cause the program causing the lock\n  // contention to be starved of CPU by node, so the contention doesn't resolve.\n  if (platform === \"win32\") {\n    fs.rename = (function (fs$rename) { return function (from, to, cb) {\n      var start = Date.now()\n      var backoff = 0;\n      fs$rename(from, to, function CB (er) {\n        if (er\n            && (er.code === \"EACCES\" || er.code === \"EPERM\")\n            && Date.now() - start < 60000) {\n          setTimeout(function() {\n            fs.stat(to, function (stater, st) {\n              if (stater && stater.code === \"ENOENT\")\n                fs$rename(from, to, CB);\n              else\n                cb(er)\n            })\n          }, backoff)\n          if (backoff < 100)\n            backoff += 10;\n          return;\n        }\n        if (cb) cb(er)\n      })\n    }})(fs.rename)\n  }\n\n  // if read() returns EAGAIN, then just try it again.\n  fs.read = (function (fs$read) {\n    function read (fd, buffer, offset, length, position, callback_) {\n      var callback\n      if (callback_ && typeof callback_ === 'function') {\n        var eagCounter = 0\n        callback = function (er, _, __) {\n          if (er && er.code === 'EAGAIN' && eagCounter < 10) {\n            eagCounter ++\n            return fs$read.call(fs, fd, buffer, offset, length, position, callback)\n          }\n          callback_.apply(this, arguments)\n        }\n      }\n      return fs$read.call(fs, fd, buffer, offset, length, position, callback)\n    }\n\n    // This ensures `util.promisify` works as it does for native `fs.read`.\n    if (Object.setPrototypeOf) Object.setPrototypeOf(read, fs$read)\n    return read\n  })(fs.read)\n\n  fs.readSync = (function (fs$readSync) { return function (fd, buffer, offset, length, position) {\n    var eagCounter = 0\n    while (true) {\n      try {\n        return fs$readSync.call(fs, fd, buffer, offset, length, position)\n      } catch (er) {\n        if (er.code === 'EAGAIN' && eagCounter < 10) {\n          eagCounter ++\n          continue\n        }\n        throw er\n      }\n    }\n  }})(fs.readSync)\n\n  function patchLchmod (fs) {\n    fs.lchmod = function (path, mode, callback) {\n      fs.open( path\n             , constants.O_WRONLY | constants.O_SYMLINK\n             , mode\n             , function (err, fd) {\n        if (err) {\n          if (callback) callback(err)\n          return\n        }\n        // prefer to return the chmod error, if one occurs,\n        // but still try to close, and report closing errors if they occur.\n        fs.fchmod(fd, mode, function (err) {\n          fs.close(fd, function(err2) {\n            if (callback) callback(err || err2)\n          })\n        })\n      })\n    }\n\n    fs.lchmodSync = function (path, mode) {\n      var fd = fs.openSync(path, constants.O_WRONLY | constants.O_SYMLINK, mode)\n\n      // prefer to return the chmod error, if one occurs,\n      // but still try to close, and report closing errors if they occur.\n      var threw = true\n      var ret\n      try {\n        ret = fs.fchmodSync(fd, mode)\n        threw = false\n      } finally {\n        if (threw) {\n          try {\n            fs.closeSync(fd)\n          } catch (er) {}\n        } else {\n          fs.closeSync(fd)\n        }\n      }\n      return ret\n    }\n  }\n\n  function patchLutimes (fs) {\n    if (constants.hasOwnProperty(\"O_SYMLINK\")) {\n      fs.lutimes = function (path, at, mt, cb) {\n        fs.open(path, constants.O_SYMLINK, function (er, fd) {\n          if (er) {\n            if (cb) cb(er)\n            return\n          }\n          fs.futimes(fd, at, mt, function (er) {\n            fs.close(fd, function (er2) {\n              if (cb) cb(er || er2)\n            })\n          })\n        })\n      }\n\n      fs.lutimesSync = function (path, at, mt) {\n        var fd = fs.openSync(path, constants.O_SYMLINK)\n        var ret\n        var threw = true\n        try {\n          ret = fs.futimesSync(fd, at, mt)\n          threw = false\n        } finally {\n          if (threw) {\n            try {\n              fs.closeSync(fd)\n            } catch (er) {}\n          } else {\n            fs.closeSync(fd)\n          }\n        }\n        return ret\n      }\n\n    } else {\n      fs.lutimes = function (_a, _b, _c, cb) { if (cb) process.nextTick(cb) }\n      fs.lutimesSync = function () {}\n    }\n  }\n\n  function chmodFix (orig) {\n    if (!orig) return orig\n    return function (target, mode, cb) {\n      return orig.call(fs, target, mode, function (er) {\n        if (chownErOk(er)) er = null\n        if (cb) cb.apply(this, arguments)\n      })\n    }\n  }\n\n  function chmodFixSync (orig) {\n    if (!orig) return orig\n    return function (target, mode) {\n      try {\n        return orig.call(fs, target, mode)\n      } catch (er) {\n        if (!chownErOk(er)) throw er\n      }\n    }\n  }\n\n\n  function chownFix (orig) {\n    if (!orig) return orig\n    return function (target, uid, gid, cb) {\n      return orig.call(fs, target, uid, gid, function (er) {\n        if (chownErOk(er)) er = null\n        if (cb) cb.apply(this, arguments)\n      })\n    }\n  }\n\n  function chownFixSync (orig) {\n    if (!orig) return orig\n    return function (target, uid, gid) {\n      try {\n        return orig.call(fs, target, uid, gid)\n      } catch (er) {\n        if (!chownErOk(er)) throw er\n      }\n    }\n  }\n\n  function statFix (orig) {\n    if (!orig) return orig\n    // Older versions of Node erroneously returned signed integers for\n    // uid + gid.\n    return function (target, options, cb) {\n      if (typeof options === 'function') {\n        cb = options\n        options = null\n      }\n      function callback (er, stats) {\n        if (stats) {\n          if (stats.uid < 0) stats.uid += 0x100000000\n          if (stats.gid < 0) stats.gid += 0x100000000\n        }\n        if (cb) cb.apply(this, arguments)\n      }\n      return options ? orig.call(fs, target, options, callback)\n        : orig.call(fs, target, callback)\n    }\n  }\n\n  function statFixSync (orig) {\n    if (!orig) return orig\n    // Older versions of Node erroneously returned signed integers for\n    // uid + gid.\n    return function (target, options) {\n      var stats = options ? orig.call(fs, target, options)\n        : orig.call(fs, target)\n      if (stats.uid < 0) stats.uid += 0x100000000\n      if (stats.gid < 0) stats.gid += 0x100000000\n      return stats;\n    }\n  }\n\n  // ENOSYS means that the fs doesn't support the op. Just ignore\n  // that, because it doesn't matter.\n  //\n  // if there's no getuid, or if getuid() is something other\n  // than 0, and the error is EINVAL or EPERM, then just ignore\n  // it.\n  //\n  // This specific case is a silent failure in cp, install, tar,\n  // and most other unix tools that manage permissions.\n  //\n  // When running as root, or if other types of errors are\n  // encountered, then it's strict.\n  function chownErOk (er) {\n    if (!er)\n      return true\n\n    if (er.code === \"ENOSYS\")\n      return true\n\n    var nonroot = !process.getuid || process.getuid() !== 0\n    if (nonroot) {\n      if (er.code === \"EINVAL\" || er.code === \"EPERM\")\n        return true\n    }\n\n    return false\n  }\n}\n\n\n//# sourceURL=webpack://@pipcook/plugins-bayesian-model-define/./node_modules/graceful-fs/polyfills.js?");

/***/ }),

/***/ "./node_modules/jsonfile/index.js":
/*!****************************************!*\
  !*** ./node_modules/jsonfile/index.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("let _fs\ntry {\n  _fs = __webpack_require__(/*! graceful-fs */ \"./node_modules/graceful-fs/graceful-fs.js\")\n} catch (_) {\n  _fs = __webpack_require__(/*! fs */ \"fs\")\n}\nconst universalify = __webpack_require__(/*! universalify */ \"./node_modules/universalify/index.js\")\nconst { stringify, stripBom } = __webpack_require__(/*! ./utils */ \"./node_modules/jsonfile/utils.js\")\n\nasync function _readFile (file, options = {}) {\n  if (typeof options === 'string') {\n    options = { encoding: options }\n  }\n\n  const fs = options.fs || _fs\n\n  const shouldThrow = 'throws' in options ? options.throws : true\n\n  let data = await universalify.fromCallback(fs.readFile)(file, options)\n\n  data = stripBom(data)\n\n  let obj\n  try {\n    obj = JSON.parse(data, options ? options.reviver : null)\n  } catch (err) {\n    if (shouldThrow) {\n      err.message = `${file}: ${err.message}`\n      throw err\n    } else {\n      return null\n    }\n  }\n\n  return obj\n}\n\nconst readFile = universalify.fromPromise(_readFile)\n\nfunction readFileSync (file, options = {}) {\n  if (typeof options === 'string') {\n    options = { encoding: options }\n  }\n\n  const fs = options.fs || _fs\n\n  const shouldThrow = 'throws' in options ? options.throws : true\n\n  try {\n    let content = fs.readFileSync(file, options)\n    content = stripBom(content)\n    return JSON.parse(content, options.reviver)\n  } catch (err) {\n    if (shouldThrow) {\n      err.message = `${file}: ${err.message}`\n      throw err\n    } else {\n      return null\n    }\n  }\n}\n\nasync function _writeFile (file, obj, options = {}) {\n  const fs = options.fs || _fs\n\n  const str = stringify(obj, options)\n\n  await universalify.fromCallback(fs.writeFile)(file, str, options)\n}\n\nconst writeFile = universalify.fromPromise(_writeFile)\n\nfunction writeFileSync (file, obj, options = {}) {\n  const fs = options.fs || _fs\n\n  const str = stringify(obj, options)\n  // not sure if fs.writeFileSync returns anything, but just in case\n  return fs.writeFileSync(file, str, options)\n}\n\nconst jsonfile = {\n  readFile,\n  readFileSync,\n  writeFile,\n  writeFileSync\n}\n\nmodule.exports = jsonfile\n\n\n//# sourceURL=webpack://@pipcook/plugins-bayesian-model-define/./node_modules/jsonfile/index.js?");

/***/ }),

/***/ "./node_modules/jsonfile/utils.js":
/*!****************************************!*\
  !*** ./node_modules/jsonfile/utils.js ***!
  \****************************************/
/***/ ((module) => {

eval("function stringify (obj, { EOL = '\\n', finalEOL = true, replacer = null, spaces } = {}) {\n  const EOF = finalEOL ? EOL : ''\n  const str = JSON.stringify(obj, replacer, spaces)\n\n  return str.replace(/\\n/g, EOL) + EOF\n}\n\nfunction stripBom (content) {\n  // we do this because JSON.parse would convert it to a utf8 string if encoding wasn't specified\n  if (Buffer.isBuffer(content)) content = content.toString('utf8')\n  return content.replace(/^\\uFEFF/, '')\n}\n\nmodule.exports = { stringify, stripBom }\n\n\n//# sourceURL=webpack://@pipcook/plugins-bayesian-model-define/./node_modules/jsonfile/utils.js?");

/***/ }),

/***/ "./node_modules/universalify/index.js":
/*!********************************************!*\
  !*** ./node_modules/universalify/index.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";
eval("\n\nexports.fromCallback = function (fn) {\n  return Object.defineProperty(function (...args) {\n    if (typeof args[args.length - 1] === 'function') fn.apply(this, args)\n    else {\n      return new Promise((resolve, reject) => {\n        fn.call(\n          this,\n          ...args,\n          (err, res) => (err != null) ? reject(err) : resolve(res)\n        )\n      })\n    }\n  }, 'name', { value: fn.name })\n}\n\nexports.fromPromise = function (fn) {\n  return Object.defineProperty(function (...args) {\n    const cb = args[args.length - 1]\n    if (typeof cb !== 'function') return fn.apply(this, args)\n    else fn.apply(this, args.slice(0, -1)).then(r => cb(null, r), cb)\n  }, 'name', { value: fn.name })\n}\n\n\n//# sourceURL=webpack://@pipcook/plugins-bayesian-model-define/./node_modules/universalify/index.js?");

/***/ }),

/***/ "./src/model.js":
/*!**********************!*\
  !*** ./src/model.js ***!
  \**********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const { load, cut } = __webpack_require__(/*! @node-rs/jieba */ \"@node-rs/jieba\");\nconst { DataCook } = __webpack_require__(/*! @pipcook/core */ \"@pipcook/core\");\nconst { cn, en } = __webpack_require__(/*! ./stopwords */ \"./src/stopwords.js\");\nconst path = __webpack_require__(/*! path */ \"path\");\nconst fs = __webpack_require__(/*! fs-extra */ \"./node_modules/fs-extra/lib/index.js\");\nconst { MultinomialNB } = DataCook.Model.NaiveBayes;\nconst { CountVectorizer } = DataCook.Text;\nconst { accuracyScore  } = DataCook.Metrics;\n\nlet classifier;\nlet vectorizer;\n\nload();\n\nconst textProcessing = (row_data, mode='cn') => {\n  let words_list = [];\n  row_data.forEach((data, i) => {\n    if (mode == 'cn'){\n      const word_cut = cut(data);\n      words_list.push(word_cut);\n    } else {\n      words_list.push(data)\n    }\n  });\n  return words_list\n}\n\nconst train = async (runtime, options, context) => {\n  const { mode = 'cn' } = options;\n  const { modelDir } = context.workspace;\n  const classifier = new MultinomialNB();\n  const vectorizer = new CountVectorizer();\n\n  const trainData = [];\n  const trainClass = [];\n  // access train samples\n  const trainSamples = await runtime.dataset.train.nextBatch(-1);\n  trainSamples.forEach((d) => {\n    trainData.push(d.data);\n    trainClass.push(d.label.toString());\n  });\n  // process text dataset\n  const trainWordsList = textProcessing(trainData);\n  let stopWords = mode === 'en' ? en : cn;\n  vectorizer.initDict(trainWordsList, stopWords);\n  const trainVector = vectorizer.transform(trainWordsList);\n  // train model\n  await classifier.train(trainVector, trainClass);\n  // predict\n  const predClass = classifier.predict(trainVector);\n  const acc = accuracyScore(trainClass, predClass);\n  console.log(`train accuracy: ${acc}`);\n  // save model file \n  await fs.writeFile(path.join(modelDir, 'model.json'), classifier.toJson());\n  await fs.writeFile(path.join(modelDir, 'vectorizer.json'), vectorizer.toJson());\n  await runtime.saveModel(modelDir);\n};\n\nconst modelLoad = async (context) => {\n  const { modelDir } = context.workspace;\n  const classifier = new MultinomialNB();\n  const vectorizer = new CountVectorizer();\n\n  const modelFs = await fs.readFile(path.join(modelDir, 'model.json'));\n  \n  const modelJson = modelFs.toString();\n  const vectorizerFs =  await fs.readFile(path.join(modelDir, 'vectorizer.json'));\n  const vectorizerJson = vectorizerFs.toString();\n  if (modelJson) classifier.load(modelJson);\n  if (vectorizerJson) vectorizer.load(vectorizerJson);\n  return [ classifier, vectorizer ];\n};\n\nconst predict = async (runtime, options, context) => {\n  if (!classifier || !vectorizer) {\n    [ classifier, vectorizer ] = await modelLoad(context);\n  }\n  // access predict samples\n  const predictData = [];\n  const predictSamples = await runtime.dataset.predicted.nextBatch(-1);\n  predictSamples.forEach((d) => {\n    predictData.push(d.data);\n  });\n  // process text dataset\n  const predictWordsList = textProcessing(predictData);\n  const predictVector = vectorizer.transform(predictWordsList);\n  const predClasses = classifier.predict(predictVector).dataSync();\n  const predIds = predClasses.map((predClass) => classifier.classMap[predClass])\n  const predProbs = classifier.predictProba(predictVector).arraySync();\n  const predictResult = predClasses.map((predClass, i)=>{\n    const res = {id: predIds[i], category: predClass, score: predProbs[i][predIds[i]]}\n    return res\n  })\n  console.log(predictResult);\n  return predictResult\n}\n\nmodule.exports = {\n  train,\n  predict\n}\n\n\n\n//# sourceURL=webpack://@pipcook/plugins-bayesian-model-define/./src/model.js?");

/***/ }),

/***/ "./src/stopwords.js":
/*!**************************!*\
  !*** ./src/stopwords.js ***!
  \**************************/
/***/ ((__unused_webpack_module, exports) => {

eval("const cn = '的\\n一\\n不\\n在\\n人\\n有\\n是\\n为\\n以\\n于\\n上\\n他\\n而\\n后\\n之\\n来\\n及\\n了\\n因\\n下\\n可\\n到\\n由\\n这\\n与\\n也\\n此\\n但\\n并\\n个\\n其\\n已\\n无\\n小\\n我\\n们\\n起\\n最\\n再\\n今\\n去\\n好\\n只\\n又\\n或\\n很\\n亦\\n某\\n把\\n那\\n你\\n乃\\n它\\n怎么\\n任何\\n连同\\n开外\\n再有\\n哪些\\n甚至于\\n又及\\n当然\\n就是\\n遵照\\n以来\\n赖以\\n否则\\n此间\\n后者\\n按照\\n才是\\n自身\\n再则\\n就算\\n即便\\n有些\\n例如\\n它们\\n虽然\\n为此\\n以免\\n别处\\n我们\\n依据\\n趁着\\n就要\\n各位\\n别的\\n前者\\n不外乎\\n虽说\\n除此\\n个别\\n的话\\n甚而\\n那般\\n譬如\\n作为\\n谁人\\n进而\\n那边\\n首先\\n因此\\n怎么样\\n果然\\n除非\\n以上\\n为何\\n要么\\n随时\\n如果说\\n诸如\\n还是\\n一旦\\n基于\\n本人\\n因而\\n继而\\n不单\\n此时\\n等等\\n截至\\n不但\\n故而\\n全体\\n从此\\n对于\\n朝着\\n怎样\\n以为\\n那儿\\n或是\\n本身\\n况且\\n处在\\n吧\\n不至于\\n那个\\n被\\n诸位\\n从而\\n比\\n各自\\n针对\\n此外\\n何处\\n为了\\n这般\\n别\\n仍旧\\n既然\\n反而\\n关于\\n较之\\n不管\\n趁\\n彼时\\n这边\\n不光\\n宁可\\n要是\\n其他\\n其它\\n由于\\n还要\\n经过\\n不过\\n来说\\n当\\n从\\n除了\\n到\\n既是\\n的确\\n得\\n说来\\n打\\n据此\\n只限于\\n什么的\\n还有\\n只怕\\n不尽\\n多会\\n正巧\\n凡\\n为什么\\n以至\\n以致\\n某个\\n与否\\n凭借\\n儿\\n不仅\\n尔\\n两者\\n该\\n另外\\n一来\\n正如\\n那里\\n不尽然\\n毋宁\\n这儿\\n嘿嘿\\n就是说\\n正是\\n既往\\n随着\\n于是\\n各\\n给\\n跟\\n那么\\n而后\\n和\\n何\\n似的\\n不料\\n其余\\n或者\\n介于\\n别人\\n还\\n这个\\n受到\\n只是\\n即使\\n即\\n几\\n不论\\n本着\\n既\\n及至\\n加以\\n多么\\n其中\\n别说\\n这会\\n依照\\n人们\\n如此\\n个人\\n出来\\n看\\n另一方面\\n唯有\\n据\\n距\\n靠\\n接着\\n何况\\n啦\\n加之\\n至今\\n凡是\\n他们\\n一切\\n那时\\n只限\\n不然\\n许多\\n在于\\n了\\n某某\\n除外\\n来自\\n便于\\n同时\\n只消\\n只需\\n不如\\n只要\\n另\\n并不\\n不仅仅\\n这里\\n么\\n总之\\n因为\\n每\\n固然\\n们\\n不是\\n嘛\\n或者说\\n然而\\n假如\\n如何\\n这么\\n可见\\n如果\\n拿\\n简言之\\n多少\\n哪\\n那\\n光是\\n非但\\n呵呵\\n只有\\n只因\\n连带\\n正值\\n沿着\\n哪儿\\n他人\\n若非\\n怎么办\\n她们\\n您\\n凭\\n而且\\n与其\\n如同下\\n有的\\n那些\\n甚至\\n为止\\n无论\\n鉴于\\n嘻嘻\\n哪个\\n然后\\n直到\\n且\\n却\\n并非\\n对比\\n为着\\n一些\\n让\\n何时\\n仍\\n啥\\n而是\\n自从\\n比如\\n之所以\\n如\\n你们\\n若\\n使\\n那样\\n所以\\n得了\\n谁\\n当地\\n有关\\n所有\\n因之\\n用来\\n虽\\n随\\n所在\\n同\\n对待\\n而外\\n分别\\n所\\n她\\n某些\\n对方\\n哇\\n嗡\\n往\\n哪\\n不只\\n但是\\n全部\\n尽管\\n些\\n大家\\n以便\\n自己\\n可是\\n反之\\n这些\\n向\\n什么\\n由此\\n万一\\n而已\\n何以\\n咱们\\n沿\\n值此\\n向着\\n哪怕\\n倘若\\n出于\\n哟\\n如上\\n如若\\n替代\\n用\\n什么样\\n如是\\n照着\\n此处\\n于\\n这样\\n每当\\n咱\\n此次\\n至于\\n则\\n怎\\n曾\\n至\\n致\\n此地\\n要不然\\n逐步\\n格里斯\\n本地\\n着\\n诸\\n要不\\n自\\n其次\\n尽管如此\\n遵循\\n乃至\\n若是\\n并且\\n如下\\n可以\\n才能\\n以及\\n彼此\\n根据\\n随后\\n有时';\nconst en = 'i\\nme\\nmy\\nmyself\\nwe\\nour\\nours\\nourselves\\nyou\\nyour\\nyours\\nyourself\\nyourselves\\nhe\\nhim\\nhis\\nhimself\\nshe\\nher\\nhers\\nherself\\nit\\nits\\nitself\\nthey\\nthem\\ntheir\\ntheirs\\nthemselves\\nwhat\\nwhich\\nwho\\nwhom\\nthis\\nthat\\nthese\\nthose\\nam\\nis\\nare\\nwas\\nwere\\nbe\\nbeen\\nbeing\\nhave\\nhas\\nhad\\nhaving\\ndo\\ndoes\\ndid\\ndoing\\na\\nan\\nthe\\nand\\nbut\\nif\\nor\\nbecause\\nas\\nuntil\\nwhile\\nof\\nat\\nby\\nfor\\nwith\\nabout\\nagainst\\nbetween\\ninto\\nthrough\\nduring\\nbefore\\nafter\\nabove\\nbelow\\nto\\nfrom\\nup\\ndown\\nin\\nout\\non\\noff\\nover\\nunder\\nagain\\nfurther\\nthen\\nonce\\nhere\\nthere\\nwhen\\nwhere\\nwhy\\nhow\\nall\\nany\\nboth\\neach\\nfew\\nmore\\nmost\\nother\\nsome\\nsuch\\nno\\nnor\\nnot\\nonly\\nown\\nsame\\nso\\nthan\\ntoo\\nvery\\ns\\nt\\ncan\\nwill\\njust\\ndon\\nshould\\nnow';\n\nexports = {\n  cn,\n  en\n};\n\n\n//# sourceURL=webpack://@pipcook/plugins-bayesian-model-define/./src/stopwords.js?");

/***/ }),

/***/ "@node-rs/jieba":
/*!*********************************!*\
  !*** external "@node-rs/jieba" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = require("@node-rs/jieba");;

/***/ }),

/***/ "@pipcook/core":
/*!********************************!*\
  !*** external "@pipcook/core" ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = require("@pipcook/core");;

/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("assert");;

/***/ }),

/***/ "constants":
/*!****************************!*\
  !*** external "constants" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("constants");;

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");;

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");;

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");;

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("util");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
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
/******/ 	var __webpack_exports__ = __webpack_require__("./src/model.js");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});