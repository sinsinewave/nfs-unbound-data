"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = exports.Log = void 0;
var Log = /** @class */ (function () {
    function Log() {
        this.level = 1;
        this.d = new Date();
    }
    Log.prototype.print = function (text, colour, label) {
        this.d = new Date();
        var timeString = String(this.d.getHours()).padStart(2, '0')
            + ":" + String(this.d.getMinutes()).padStart(2, '0')
            + ":" + String(this.d.getSeconds()).padStart(2, '0');
        console.log("\u001B[1;37;100m ".concat(timeString, " \u001B[1;30;4").concat(colour, "m ").concat(label, " \u001B[0m ").concat(text));
    };
    Log.prototype.dbug = function (text) { if (this.level <= 0) {
        this.print(text, 4, "DBUG");
    } };
    Log.prototype.info = function (text) { if (this.level <= 1) {
        this.print(text, 2, "INFO");
    } };
    Log.prototype.warn = function (text) { if (this.level <= 2) {
        this.print(text, 3, "WARN");
    } };
    Log.prototype.fail = function (text) { if (this.level <= 3) {
        this.print(text, 1, "FAIL");
    } };
    return Log;
}());
exports.Log = Log;
exports.log = new Log();
