export class VisualCarPart {
    scopes : number[]
    flags  : {}

    constructor(
        public id    : number,
        public set   : string,
        public brand : string = "generic"
    ) {
        this.scopes = []
        this.flags  = {
            purchasable : true,
            ignoreUI    : false,
            shared      : false
        }
    }
}
