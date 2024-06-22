import { Car           } from "./Car.js"
import { CarVisualPart } from "./CarVisualPart.js"

export class CarTemplate {
    name        : {}
    cars        : Car[]
    visualParts : CarVisualPart[]

    constructor(
        public path      : string,
               brand     : string,
               model     : string,
               year      : number,
        public isTraffic : boolean = false
    ) {
        this.name = {
            brand : brand,
            model : model,
            year  : year
        }
        this.cars        = []
        this.visualParts = []
    }
}
