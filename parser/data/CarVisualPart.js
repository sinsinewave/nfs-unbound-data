"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartType = exports.CarVisualPart = void 0;
var CarVisualPart = /** @class */ (function () {
    function CarVisualPart(path, id, set, type, brand, implemented) {
        if (type === void 0) { type = PartType.INTERNAL_UNKNOWN; }
        if (brand === void 0) { brand = "generic"; }
        if (implemented === void 0) { implemented = true; }
        this.path = path;
        this.id = id;
        this.set = set;
        this.type = type;
        this.brand = brand;
        this.implemented = implemented;
        this.scopes = [];
        this.flags = {
            purchasable: true,
            ignoreUI: false,
            shared: false
        };
    }
    CarVisualPart.prototype.setTypeAsString = function (type) {
        switch (type.toLowerCase()) {
            // Wheels
            case "wheelf":
            case "wheelfl":
            case "wheelfr": {
                this.type = PartType.WHEELS_FRONT;
                break;
            }
            case "wheelr":
            case "wheelrl":
            case "wheelrr": {
                this.type = PartType.WHEELS_REAR;
                break;
            }
            case "tirer":
            case "tirerr":
            case "tirerl": {
                this.type = PartType.TYRES_REAR;
                break;
            }
            case "tiref":
            case "tirefr":
            case "tirefl": {
                this.type = PartType.TYRES_FRONT;
                break;
            }
            case "caliperr":
            case "caliperrl":
            case "caliperrr": {
                this.type = PartType.CALIPERS_REAR;
                break;
            }
            case "caliperf":
            case "caliperfl":
            case "caliperfr": {
                this.type = PartType.CALIPERS_FRONT;
                break;
            }
            case "brakediscr":
            case "brakediscrr":
            case "brakediscrl": {
                this.type = PartType.BRAKEDISKS_REAR;
                break;
            }
            case "brakediscf":
            case "brakediscfr":
            case "brakediscfl": {
                this.type = PartType.BRAKEDISKS_FRONT;
                break;
            }
            // Lights
            case "headlights": {
                this.type = PartType.HEADLIGHTS;
                break;
            }
            case "taillights": {
                this.type = PartType.TAILLIGHTS;
                break;
            }
            case "spotlight": {
                this.type = PartType.LIGHTBAR;
                break;
            }
            // Aero
            case "canardsr": {
                this.type = PartType.CANARDS_REAR;
                break;
            }
            case "canardsf": {
                this.type = PartType.CANARDS_FRONT;
                break;
            }
            case "splitter": {
                this.type = PartType.SPLITTER;
                break;
            }
            case "spoiler": {
                this.type = PartType.SPOILER;
                break;
            }
            case "diffuser": {
                this.type = PartType.DIFFUSER;
                break;
            }
            // Body
            case "mirrors": {
                this.type = PartType.MIRRORS;
                break;
            }
            case "bumperf": {
                this.type = PartType.BUMPER_FRONT;
                break;
            }
            case "bumperr": {
                this.type = PartType.BUMPER_REAR;
                break;
            }
            case "skirts": {
                this.type = PartType.SKIRTS;
                break;
            }
            case "boot": {
                this.type = PartType.BOOT;
                break;
            }
            case "hood": {
                this.type = PartType.BONNET;
                break;
            }
            case "fenderf":
            case "fendersf": {
                this.type = PartType.FENDERS_FRONT;
                break;
            }
            case "fenderr":
            case "fendersr": {
                this.type = PartType.FENDERS_REAR;
                break;
            }
            case "roof": {
                this.type = PartType.ROOF;
                break;
            }
            case "grille": {
                this.type = PartType.GRILLE;
                break;
            }
            case "sidetrim": {
                this.type = PartType.TRIM;
                break;
            }
            // Misc
            case "exhausts":
            case "exhaust": {
                this.type = PartType.EXHAUSTS;
                break;
            }
            case "engine": {
                this.type = PartType.ENGINE;
                break;
            }
            case "chassis": {
                this.type = PartType.CHASSIS;
                break;
            }
            default: {
                this.type = PartType.INTERNAL_UNKNOWN;
            }
        }
    };
    return CarVisualPart;
}());
exports.CarVisualPart = CarVisualPart;
var PartType;
(function (PartType) {
    PartType["HEADLIGHTS"] = "Headlights";
    PartType["SPLITTER"] = "Splitter";
    PartType["MIRRORS"] = "Mirrors";
    PartType["WHEELS_FRONT"] = "Front Rims";
    PartType["WHEELS_REAR"] = "Rear Rims";
    PartType["TYRES_REAR"] = "Rear Tyres";
    PartType["TYRES_FRONT"] = "Front Tyres";
    PartType["TYRES_GONE"] = "";
    PartType["BRAKEDISKS_FRONT"] = "Front Brake Disks";
    PartType["BRAKEDISKS_REAR"] = "Rear Brake Disks";
    PartType["CALIPERS_REAR"] = "Rear Brake Calipers";
    PartType["CALIPERS_FRONT"] = "Front Brake Calipers";
    PartType["BOOT"] = "Boot";
    PartType["ROOF"] = "Roof";
    PartType["CANARDS_FRONT"] = "Front Canards";
    PartType["CANARDS_REAR"] = "Rear Canards";
    PartType["BUMPER_FRONT"] = "Front Bumper";
    PartType["BUMPER_REAR"] = "Rear Bumper";
    PartType["SKIRTS"] = "Side Skirts";
    PartType["EXHAUSTS"] = "Exhausts";
    PartType["BONNET"] = "Bonnet";
    PartType["TAILLIGHTS"] = "Tail Lights";
    PartType["DIFFUSER"] = "Diffuser";
    PartType["SPOILER"] = "Spoiler";
    PartType["FENDERS_FRONT"] = "Front Fenders";
    PartType["FENDERS_REAR"] = "Rear Fenders";
    PartType["ENGINE"] = "Engine";
    PartType["GRILLE"] = "Grille";
    PartType["TRIM"] = "Side Trim";
    PartType["LIGHTBAR"] = "Auxiliary Light";
    PartType["CHASSIS"] = "Chassis";
    PartType["INTERNAL_UNKNOWN"] = "Internal or Unknown";
})(PartType || (exports.PartType = PartType = {}));
