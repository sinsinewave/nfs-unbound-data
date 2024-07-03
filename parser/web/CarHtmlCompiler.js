"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarHtmlCompiler = void 0;
var Log_js_1 = require("../util/Log.js");
var eta_1 = require("eta");
var fs = require("fs");
var path = require("path");
var eta = new eta_1.Eta({ views: path.join(__dirname, "templates"), autoTrim: ["slurp", false] });
var CarHtmlCompiler = /** @class */ (function () {
    function CarHtmlCompiler() {
    }
    CarHtmlCompiler.compile = function (context) {
        Log_js_1.log.info("CarHtmlCompiler :: Building HTML documents for cars");
        var _loop_1 = function (template) {
            var types = [];
            var sets = [];
            template.visualParts.forEach(function (it) {
                // Create lists of all unique sets and types to be used later
                if (!types.includes(it.type)) {
                    types.push(it.type);
                }
                if (!sets.includes(it.set.toLowerCase()) && it.set.toLowerCase() != "shared") {
                    sets.push(it.set.toLowerCase());
                }
            });
            types = types.sort();
            sets = sets.sort();
            // Sort parts by set for templating
            var partsBySet = {};
            var _loop_2 = function (set) {
                partsBySet[set] = [];
                var _loop_3 = function (type) {
                    partsBySet[set].push(template.visualParts.filter(function (it) {
                        return (it.set.toLowerCase() == set && it.type == type);
                    })[0]);
                };
                for (var _c = 0, types_1 = types; _c < types_1.length; _c++) {
                    var type = types_1[_c];
                    _loop_3(type);
                }
            };
            for (var _b = 0, sets_1 = sets; _b < sets_1.length; _b++) {
                var set = sets_1[_b];
                _loop_2(set);
            }
            // Render main table with Eta
            var document_1 = eta.render("./carPartTable", {
                headers: types,
                sets: sets,
                parts: partsBySet
            });
            // Write table HTML files
            var outFile = path.join(context.args.outPath, "".concat(template.getName(), ".html"));
            Log_js_1.log.info("CarHtmlCompiler :: Writing ".concat(outFile));
            fs.writeFileSync(outFile, document_1, { flag: 'w' });
        };
        for (var _i = 0, _a = context.carTemplates; _i < _a.length; _i++) {
            var template = _a[_i];
            _loop_1(template);
        }
        return context;
    };
    return CarHtmlCompiler;
}());
exports.CarHtmlCompiler = CarHtmlCompiler;
