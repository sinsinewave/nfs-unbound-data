"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarTemplate = void 0;
var CarTemplate = /** @class */ (function () {
    function CarTemplate(path, brand, model, year, isTraffic) {
        if (isTraffic === void 0) { isTraffic = false; }
        this.path = path;
        this.isTraffic = isTraffic;
        this.name = {
            brand: brand,
            model: model,
            year: year
        };
        this.cars = [];
        this.visualParts = [];
    }
    return CarTemplate;
}());
exports.CarTemplate = CarTemplate;
