import { Car           } from "./Car.js"
import { VisualCarPart } from "./VisualCarPart.js"

export class CarTemplate {
    name        : {}
    cars        : Car[]
    visualParts : VisualCarPart[]

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
