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
                var _loop_4 = function (type) {
                    partsBySet[set].push(template.visualParts.filter(function (it) {
                        return (it.set.toLowerCase() == set && it.type == type);
                    })[0]);
                };
                for (var _g = 0, types_1 = types; _g < types_1.length; _g++) {
                    var type = types_1[_g];
                    _loop_4(type);
                }
            };
            for (var _d = 0, sets_1 = sets; _d < sets_1.length; _d++) {
                var set = sets_1[_d];
                _loop_2(set);
            }
            var _loop_3 = function (type) {
                var typeParts = [];
                for (var set in partsBySet) {
                    typeParts = typeParts.concat(partsBySet[set].filter(function (it) { return it !== undefined && it.type === type; }));
                }
                if (typeParts.length == 0) {
                    Log_js_1.log.dbug("CarHtmlCompiler :: Removing empty type ".concat(type, " from car ").concat(template.getName()));
                    var typeIndex = types.indexOf(type, 0);
                    for (var set in partsBySet) {
                        partsBySet[set].splice(typeIndex, 1);
                    }
                    types.splice(typeIndex, 1);
                }
            };
            // Filter out empty columns
            // Need to iterate on a shallow copy of the type array
            // As the original will be modified in this loop
            for (var _e = 0, _f = types.slice(); _e < _f.length; _e++) {
                var type = _f[_e];
                _loop_3(type);
            }
            // Render main table with Eta
            var document_1 = eta.render("./root", {
                body: eta.render("./carPartTable", {
                    headers: types,
                    sets: sets,
                    parts: partsBySet,
                    scopes: template.cars
                })
            });
            // Write table HTML files
            var outFile = path.join(context.args.outPath, "cars/".concat(template.getName(), ".html"));
            Log_js_1.log.info("CarHtmlCompiler :: Writing ".concat(outFile));
            fs.writeFileSync(outFile, document_1, { flag: 'w' });
        };
        for (var _i = 0, _a = context.carTemplates; _i < _a.length; _i++) {
            var template = _a[_i];
            _loop_1(template);
        }
        Log_js_1.log.info("CarHtmlCompiler :: Generating listing HTML");
        var carGroups = {};
        context.carTemplates.sort(function (a, b) { return a.name.brand.localeCompare(b.name.brand); });
        for (var _b = 0, _c = context.carTemplates; _b < _c.length; _b++) {
            var template = _c[_b];
            if (carGroups[template.name.brand] === undefined) {
                carGroups[template.name.brand] = [];
            }
            carGroups[template.name.brand].push(template);
        }
        var document = eta.render("./root", {
            body: eta.render("./list", {
                itemGroups: carGroups
            })
        });
        Log_js_1.log.info("CarHtmlCompiler :: Writing listing file");
        fs.writeFileSync(path.join(context.args.outPath, "carlist.html"), document, { flag: 'w' });
        return context;
    };
    return CarHtmlCompiler;
}());
exports.CarHtmlCompiler = CarHtmlCompiler;
