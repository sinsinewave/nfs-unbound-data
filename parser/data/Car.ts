import { CarVisualPart } from "./CarVisualPart.js"

export class Car {
    id           : number
    name         : {}
    partScope    : CarVisualPart[]
    defaultScope : CarVisualPart[]

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
