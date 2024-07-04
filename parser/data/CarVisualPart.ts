import { log } from "../util/Log.js"

import { Car } from "./Car.js"

export class CarVisualPart {
    scopes      : Car[]  = []
    totalScopes : number = 0

    flags  : {
        purchasable : boolean,
        ignoreUI    : boolean,
        shared      : boolean
    }

    constructor(
        public path        : string,
        public id          : number,
        public set         : string,
        public type        : PartType = PartType.INTERNAL_UNKNOWN,
        public brand       : string  = "generic",
        public implemented : boolean = true
    ) {
        this.flags  =  {
            purchasable : true,
            ignoreUI    : false,
            shared      : false
        }
    }

    setTypeAsString(type: string) {
        switch(type.toLowerCase()) {
            // Wheels
            case "wheelf"       :
            case "wheelfl"      : 
            case "wheelfr"      : { this.type = PartType.WHEELS_FRONT; break }
            case "wheelr"       :
            case "wheelrl"      :
            case "wheelrr"      : { this.type = PartType.WHEELS_REAR; break }
            case "tirer"        :
            case "tirerr"       :
            case "tirerl"       : { this.type = PartType.TYRES_REAR; break }
            case "tiref"        :
            case "tirefr"       :
            case "tirefl"       : { this.type = PartType.TYRES_FRONT; break }
            case "caliperr"     :
            case "caliperrl"    :
            case "caliperrr"    : { this.type = PartType.CALIPERS_REAR; break }
            case "caliperf"     : 
            case "caliperfl"    :
            case "caliperfr"    : { this.type = PartType.CALIPERS_FRONT; break }
            case "brakediscr"   :
            case "brakediscrr"  :
            case "brakediscrl"  : { this.type = PartType.BRAKEDISKS_REAR; break }
            case "brakediscf"   : 
            case "brakediscfr"  :
            case "brakediscfl"  : { this.type = PartType.BRAKEDISKS_FRONT; break }
            // Lights
            case "headlights"   : { this.type = PartType.HEADLIGHTS; break }
            case "taillights"   : { this.type = PartType.TAILLIGHTS; break }
            case "spotlight"    : { this.type = PartType.LIGHTBAR; break }
            // Aero
            case "canardsr"     : { this.type = PartType.CANARDS_REAR; break }
            case "canardsf"     : { this.type = PartType.CANARDS_FRONT; break }
            case "splitter"     : { this.type = PartType.SPLITTER; break }
            case "spoiler"      : { this.type = PartType.SPOILER; break }
            case "diffuser"     : { this.type = PartType.DIFFUSER; break }
            // Body
            case "mirrors"      : { this.type = PartType.MIRRORS; break }
            case "bumperf"      : { this.type = PartType.BUMPER_FRONT; break }
            case "bumperr"      : { this.type = PartType.BUMPER_REAR; break }
            case "skirts"       : { this.type = PartType.SKIRTS; break }
            case "boot"         : { this.type = PartType.BOOT; break }
            case "hood"         : { this.type = PartType.BONNET; break }
            case "fenderf"      :
            case "fendersf"     : { this.type = PartType.FENDERS_FRONT; break }
            case "fenderr"      :
            case "fendersr"     : { this.type = PartType.FENDERS_REAR; break }
            case "roof"         : { this.type = PartType.ROOF; break }
            case "grille"       : { this.type = PartType.GRILLE; break }
            case "sidetrim"     : { this.type = PartType.TRIM; break }
            // Misc
            case "exhausts"     :
            case "exhaust"      : { this.type = PartType.EXHAUSTS; break }
            case "engine"       : { this.type = PartType.ENGINE; break }
            case "chassis"      : { this.type = PartType.CHASSIS; break }

            default : { this.type = PartType.INTERNAL_UNKNOWN; }
        }
    }
}

export enum PartType {
    HEADLIGHTS          = "Headlights",
    SPLITTER            = "Splitter",
    MIRRORS             = "Mirrors",
    WHEELS_FRONT        = "Front Rims",
    WHEELS_REAR         = "Rear Rims",
    TYRES_REAR          = "Rear Tyres",
    TYRES_FRONT         = "Front Tyres",
    TYRES_GONE          = "",
    BRAKEDISKS_FRONT    = "Front Brake Disks",
    BRAKEDISKS_REAR     = "Rear Brake Disks",
    CALIPERS_REAR       = "Rear Brake Calipers",
    CALIPERS_FRONT      = "Front Brake Calipers",
    BOOT                = "Boot",
    ROOF                = "Roof",
    CANARDS_FRONT       = "Front Canards",
    CANARDS_REAR        = "Rear Canards",
    BUMPER_FRONT        = "Front Bumper",
    BUMPER_REAR         = "Rear Bumper",
    SKIRTS              = "Side Skirts",
    EXHAUSTS            = "Exhausts",
    BONNET              = "Bonnet",
    TAILLIGHTS          = "Tail Lights",
    DIFFUSER            = "Diffuser",
    SPOILER             = "Spoiler",
    FENDERS_FRONT       = "Front Fenders",
    FENDERS_REAR        = "Rear Fenders",
    ENGINE              = "Engine",
    GRILLE              = "Grille",
    TRIM                = "Side Trim",
    LIGHTBAR            = "Auxiliary Light",
    CHASSIS             = "Chassis",
    INTERNAL_UNKNOWN    = "Internal or Unknown"
}
