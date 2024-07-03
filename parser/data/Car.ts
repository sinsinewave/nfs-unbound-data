import { CarVisualPart } from "./CarVisualPart.js"
import { CarTemplate   } from "./CarTemplate.js"

export class Car {
    id           : number
    name         : { model : string, year : number }
    partScope    : CarVisualPart[]
    defaultScope : CarVisualPart[]
    template     : CarTemplate

    constructor(
        public path  : string,
               id    : number,
               model : string,
               year  : number
    ) {
        this.id   = id
        this.name = {
            model : model,
            year  : year
        }
        
        this.partScope    = []
        this.defaultScope = []
    }
}
