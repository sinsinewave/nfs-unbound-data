"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarScanner = void 0;
var Log_js_1 = require("../util/Log.js");
var Files_js_1 = require("../util/Files.js");
var CarTemplate_js_1 = require("../data/CarTemplate.js");
var Car_js_1 = require("../data/Car.js");
var fs = require("fs");
var xml2js = require("xml2js");
var util = require("util");
var CarScanner = /** @class */ (function () {
    function CarScanner() {
    }
    CarScanner.scan = function (context) {
        return __awaiter(this, void 0, void 0, function () {
            var path, fileList, filesByDir, _loop_1, _i, _a, dir, _b, _c, _d, _e, dir, template, _f, _g, file, data, xmlObj, car;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        path = context.args.dataPath;
                        // Locate car XMLs and directories, with some filtering
                        Log_js_1.log.info("CarScanner :: Looking for files");
                        fileList = (0, Files_js_1.walkDir)(path, function (it) {
                            return /^(cop)?car_[0-9a-z]+_[0-9a-z]+_\d{4}(_(cop|icon))?\.xml$/gmi.test(it);
                        }, function (it) {
                            // filter to items dir, ignore secondhand vehicles, contains nothing of relevance to this tool
                            return it.includes("items") && !it.includes("secondhand_vehicles");
                        });
                        Log_js_1.log.info("CarScanner :: Found ".concat(fileList.files.length, " car XMLs in ").concat(fileList.dirs.length, " directories"));
                        Log_js_1.log.info("CarScanner :: Sorting results");
                        filesByDir = {};
                        _loop_1 = function (dir) {
                            Log_js_1.log.dbug("CarScanner :: ".concat(dir));
                            filesByDir[dir] = fileList.files.filter(function (it) {
                                return it.startsWith(dir);
                            });
                            filesByDir[dir].forEach(function (it, idx, array) { idx === (array.length - 1) ? Log_js_1.log.dbug("CarScanner :: \u2514\u2500 ".concat(it)) : Log_js_1.log.dbug("CarScanner :: \u251C\u2500 ".concat(it)); });
                        };
                        for (_i = 0, _a = fileList.dirs; _i < _a.length; _i++) {
                            dir = _a[_i];
                            _loop_1(dir);
                        }
                        Log_js_1.log.info("CarScanner :: Parsing results into objects");
                        _b = filesByDir;
                        _c = [];
                        for (_d in _b)
                            _c.push(_d);
                        _e = 0;
                        _h.label = 1;
                    case 1:
                        if (!(_e < _c.length)) return [3 /*break*/, 7];
                        _d = _c[_e];
                        if (!(_d in _b)) return [3 /*break*/, 6];
                        dir = _d;
                        template = new CarTemplate_js_1.CarTemplate(dir, dir.split("/").at(-1).split("_")[1], dir.split("/").at(-1).split("_")[2], +dir.split("/").at(-1).split("_")[3]);
                        _f = 0, _g = filesByDir[dir];
                        _h.label = 2;
                    case 2:
                        if (!(_f < _g.length)) return [3 /*break*/, 5];
                        file = _g[_f];
                        data = "";
                        Log_js_1.log.dbug("CarScanner :: Reading ".concat(file));
                        try {
                            data = fs.readFileSync(file, "UTF-8");
                        }
                        catch (err) {
                            Log_js_1.log.warn("CarScanner :: Failed to read ".concat(file, " : ").concat(err));
                            return [3 /*break*/, 4];
                        }
                        Log_js_1.log.dbug("CarScanner :: Parsing XML");
                        return [4 /*yield*/, xml2js.parseStringPromise(data)];
                    case 3:
                        xmlObj = _h.sent();
                        car = new Car_js_1.Car(file, Number(xmlObj.RaceVehicleItemData.Id[0].ItemDataId[0].Id[0]), file.split("/").at(-1).split("_")[2], file.split("/").at(-1).split("_")[3]);
                        template.cars.push(car);
                        car.template = template;
                        _h.label = 4;
                    case 4:
                        _f++;
                        return [3 /*break*/, 2];
                    case 5:
                        context.carTemplates.push(template);
                        _h.label = 6;
                    case 6:
                        _e++;
                        return [3 /*break*/, 1];
                    case 7: return [2 /*return*/, context];
                }
            });
        });
    };
    return CarScanner;
}());
exports.CarScanner = CarScanner;
