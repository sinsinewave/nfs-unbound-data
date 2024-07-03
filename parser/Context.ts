import { CarTemplate   } from "./data/CarTemplate.js"
import { CarVisualPart } from "./data/CarVisualPart.js"

export class Context {
    carTemplates   : CarTemplate[]   = []
    carVisualParts : CarVisualPart[] = []
    args           : { dataPath: string, outPath: string } = {} as any
}
