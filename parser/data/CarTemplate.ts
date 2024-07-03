import { Car           } from "./Car.js"
import { CarVisualPart } from "./CarVisualPart.js"

export class CarTemplate {
    name        : {
                    brand : string,
                    model : string,
                    year  : number
                }
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

    getName(): string {
        return `${this.name.brand}_${this.name.model}_${this.name.year}`
    }
}
