"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDir = exports.walkDir = void 0;
var fs_1 = require("fs");
var fs_2 = require("fs");
var path_1 = require("path");
/**
 * Recursively scans a directory for subdirectories and files
 *
 * @param       root            Root directory to scan from
 * @param       fileFilter      Filter function applied to file names
 * @param       dirFilter       Filter function applied to directory names
 * @param       __result        Internal, do not use
 *
 * @returns                     Object containing lists of found files and directories
 */
function walkDir(root, fileFilter, dirFilter, __result) {
    if (fileFilter === void 0) { fileFilter = function (it) { return true; }; }
    if (dirFilter === void 0) { dirFilter = function (it) { return true; }; }
    if (__result === void 0) { __result = { dirs: [], files: [] }; }
    (0, fs_1.readdirSync)(root).forEach(function (it) {
        if (isDir((0, path_1.resolve)(root, it)) && dirFilter((0, path_1.resolve)(root, it))) {
            walkDir((0, path_1.resolve)(root, it), fileFilter, dirFilter, __result);
        }
        else if (fileFilter(it) && dirFilter(root)) {
            __result.files.push((0, path_1.resolve)(root, it));
            if (!__result.dirs.includes(root)) {
                __result.dirs.push(root);
            }
        }
    });
    return __result;
}
exports.walkDir = walkDir;
/**
 * Checks whether a path is a directory
 *
 * @param       path    Path that shall be checked
 *
 * @returns             True if path is a directory, False otherwise
 */
function isDir(path) {
    return (0, fs_2.lstatSync)(path).isDirectory();
}
exports.isDir = isDir;
