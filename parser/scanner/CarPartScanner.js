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
exports.CarPartScanner = void 0;
var CarVisualPart_js_1 = require("../data/CarVisualPart.js");
var CarVisualPart_js_2 = require("../data/CarVisualPart.js");
var Log_js_1 = require("../util/Log.js");
var Files_js_1 = require("../util/Files.js");
var fs = require("fs");
var xml2js = require("xml2js");
var util = require("util");
var CarPartScanner = /** @class */ (function () {
    function CarPartScanner() {
    }
    CarPartScanner.scan = function (context) {
        return __awaiter(this, void 0, void 0, function () {
            var path;
            return __generator(this, function (_a) {
                path = context.args.dataPath;
                return [2 /*return*/, this.scanItems(path, context)];
            });
        });
    };
    CarPartScanner.scanItems = function (path, context) {
        return __awaiter(this, void 0, void 0, function () {
            var fileList, _i, _a, file, data, xmlObj, itemData, part, typeString;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        // Locate car part XMLs and directories, with some filtering
                        Log_js_1.log.info("CarPartScanner :: Looking for item files");
                        fileList = (0, Files_js_1.walkDir)(path, function (it) {
                            return /^car_[0-9a-z]+_[0-9a-z]+_\d{4}_[a-z]+_set[a-z0-9]+\.xml$/gmi.test(it) || (it.toLowerCase().startsWith("shared_") && it.endsWith(".xml"));
                        }, function (it) {
                            // Ignore secondhand vehicles, like in the car scan, we aren't interested in that
                            return it.includes("items") && !it.includes("secondhand_vehicles");
                        });
                        Log_js_1.log.info("CarPartScanner :: Found ".concat(fileList.files.length, " item XMLs in ").concat(fileList.dirs.length, " directories"));
                        _i = 0, _a = fileList.files;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        file = _a[_i];
                        data = "";
                        Log_js_1.log.dbug("CarPartScanner :: Reading ".concat(file));
                        try {
                            data = fs.readFileSync(file, "UTF-8");
                        }
                        catch (err) {
                            Log_js_1.log.warn("CarPartScanner :: Failed to read ".concat(file, " : ").concat(err));
                            return [3 /*break*/, 3];
                        }
                        Log_js_1.log.dbug("CarPartScanner :: Parsing XML");
                        return [4 /*yield*/, xml2js.parseStringPromise(data)];
                    case 2:
                        xmlObj = _b.sent();
                        itemData = xmlObj[Object.keys(xmlObj)[0]];
                        part = new CarVisualPart_js_1.CarVisualPart(file, Number(itemData.Id[0].ItemDataId[0].Id[0]), file.includes("shared_") ? "shared" : file.split("_").at(-1).split(".")[0].replace(/^(set)/, ""));
                        // Figure out ignoreUI flag
                        // For some reason i feel like this is needlessly convoluted
                        try {
                            part.flags.ignoreUI = itemData.ItemTags.filter(function (it) {
                                if (it.member === undefined) {
                                    return false;
                                }
                                return true;
                            }).map(function (it) {
                                return it.member;
                            }).filter(function (it) {
                                return it.length > 0 && it.filter(function (jt) {
                                    return jt._.includes("ignoreui");
                                }).length > 0;
                            }).length > 0;
                        }
                        catch (_c) {
                            Log_js_1.log.warn("CarPartScanner :: Unable to determine ignoreui flag for ".concat(file.split("/").at(-1)));
                        }
                        // Other flags
                        part.flags.purchasable = (itemData.Purchasable[0] == "True" ? true : false);
                        part.flags.shared = file.includes("shared_");
                        typeString = "";
                        if (file.toLowerCase().split("/").at(-1).includes("shared_")) {
                            // Shared parts have their type in a different spot of the filename
                            if (file.toLowerCase().endsWith("_r.xml")
                                || file.toLowerCase().endsWith("_f.xml")
                                || file.toLowerCase().endsWith("_fr.xml")
                                || file.toLowerCase().endsWith("_rr.xml")
                                || file.toLowerCase().endsWith("_fl.xml")
                                || file.toLowerCase().endsWith("_rl.xml")) {
                                // Most need rear/front information appended from the end of the filename too
                                typeString = "".concat(file.split("/").at(-1).split("_")[1]).concat(file.split("/").at(-1).split("_").at(-1).split(".")[0]);
                            }
                            else {
                                typeString = file.split("/").at(-1).split("_")[1];
                            }
                        }
                        else {
                            // Non-shared parts are more trivial
                            typeString = file.split("_").at(-2);
                        }
                        part.setTypeAsString(typeString);
                        if (part.type == CarVisualPart_js_2.PartType.INTERNAL_UNKNOWN) {
                            Log_js_1.log.warn("CarPartScanner :: Unable to determine part type (".concat(typeString.toLowerCase(), ") for ").concat(file.split("/").at(-1), " (").concat(part.id, ")"));
                        }
                        context.carVisualParts.push(part);
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, context];
                }
            });
        });
    };
    return CarPartScanner;
}());
exports.CarPartScanner = CarPartScanner;
