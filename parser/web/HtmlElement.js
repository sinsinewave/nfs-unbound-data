"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HtmlElement = void 0;
var assert = require("assert");
var HtmlElement = /** @class */ (function () {
    function HtmlElement(tag) {
        this.tag = tag;
        this.attrs = {
            class: [],
            id: ""
        };
        this.depth = 0;
        this.children = [];
        this.isVoid = false;
        this.body = "";
        if (["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"].includes(tag)) {
            this.isVoid = true;
        }
    }
    HtmlElement.prototype.withAttrs = function (attrs) {
        for (var a in attrs) {
            this.attrs[a] = attrs[a];
        }
        return this;
    };
    HtmlElement.prototype.withClass = function () {
        var classes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            classes[_i] = arguments[_i];
        }
        for (var _a = 0, classes_1 = classes; _a < classes_1.length; _a++) {
            var c = classes_1[_a];
            if (!this.attrs.class.includes(c)) {
                this.attrs.class.push(c);
            }
        }
        return this;
    };
    HtmlElement.prototype.withId = function (id) {
        this.attrs.id = id;
        return this;
    };
    HtmlElement.prototype.refreshDepth = function () {
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            if (child.depth == this.depth) {
                child.depth += 1;
                child.refreshDepth();
            }
        }
    };
    HtmlElement.prototype.withChildren = function () {
        var children = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            children[_i] = arguments[_i];
        }
        assert(!this.isVoid);
        for (var _a = 0, children_1 = children; _a < children_1.length; _a++) {
            var child = children_1[_a];
            child.depth = this.depth + 1;
            child.refreshDepth();
            this.children.push(child);
        }
        return this;
    };
    HtmlElement.prototype.withBody = function (body) {
        assert(!this.isVoid);
        this.body = body;
        return this;
    };
    HtmlElement.prototype.toString = function () {
        var attrString = "";
        for (var attr in this.attrs) {
            if (this.attrs[attr].length > 0) {
                attrString += " ".concat(attr, "=\"").concat(this.attrs[attr], "\"");
            }
        }
        var res = "".concat(" ".repeat(4 * this.depth), "<").concat(this.tag).concat(attrString);
        if (this.isVoid) {
            return res + "/>";
        }
        else {
            res += ">\n";
            if (this.body.length > 0) {
                res += "".concat(" ".repeat(4 * (this.depth + 1))).concat(this.body, "\n");
            }
            for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
                var child = _a[_i];
                res += "".concat(child.toString(), "\n");
            }
            res += "".concat(" ".repeat(4 * this.depth), "</").concat(this.tag, ">");
            return res;
        }
    };
    return HtmlElement;
}());
exports.HtmlElement = HtmlElement;
