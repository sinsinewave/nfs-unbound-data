"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Car = void 0;
var Car = /** @class */ (function () {
    function Car(path, id, model, year) {
        this.path = path;
        this.id = id;
        this.name = {
            model: model,
            year: year
        };
        this.partScope = [];
        this.defaultScope = [];
    }
    return Car;
}());
exports.Car = Car;
