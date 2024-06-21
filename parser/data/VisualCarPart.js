"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisualCarPart = void 0;
var VisualCarPart = /** @class */ (function () {
    function VisualCarPart(id, set, brand) {
        if (brand === void 0) { brand = "generic"; }
        this.id = id;
        this.set = set;
        this.brand = brand;
        this.scopes = [];
        this.flags = {
            purchasable: true,
            ignoreUI: false,
            shared: false
        };
    }
    return VisualCarPart;
}());
exports.VisualCarPart = VisualCarPart;
