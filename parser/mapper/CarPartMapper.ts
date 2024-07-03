import { CarVisualPart } from "../data/CarVisualPart.js"
import { PartType      } from "../data/CarVisualPart.js"

import { Context } from "../Context.js"

import { log     } from "../util/Log.js"

let fs     = require("fs")
let xml2js = require("xml2js")
let util   = require("util")

export class CarPartMapper {
    static async map(
        context: Context
    ): Promise<Context> {
        log.info("CarPartMapper :: Mapping in-scope car parts")

        for (let carTemplate of context.carTemplates) {
            for (let car of carTemplate.cars) {
                // Read XML
                let data = ""
                try { data = fs.readFileSync(car.path, "UTF-8") }
                catch(err) { log.warn(`CarPartMapper :: Failed to read ${car.path} : ${err}`); continue }

                log.dbug("CarPartMapper :: Parsing XML")
                let xmlObj = await xml2js.parseStringPromise(data)

                let sortedScope = xmlObj.RaceVehicleItemData.SortedScope[0].member.map((it) => {
                    return Number(it.ItemDataId[0].Id[0])
                })

                // Actually do the mapping
                car.partScope = context.carVisualParts.filter((it) => {
                    return sortedScope.includes(it.id)
                })

                car.partScope.forEach((it) => {
                    if (!carTemplate.visualParts.includes(it)) {
                        carTemplate.visualParts.push(it)
                    }
                    if (!it.scopes.includes(car)) {
                        it.scopes.push(car)
                    }
                })
            }
        }

        log.info("CarPartMapper :: Mapping out-of-scope car parts")
        // Map based on parent directory
        for (let carTemplate of context.carTemplates) {
            context.carVisualParts.filter((it) => {
                return !carTemplate.visualParts.includes(it)
            }).forEach((it) => {
                if (it.path.toLowerCase().includes(carTemplate.path.toLowerCase())) {
                    carTemplate.visualParts.push(it)
                }
                // Special cases
                // Ugh
                // Criterion why
                else if (it.path.includes("polerstar_1_2020") && carTemplate.path.includes("polestar_1_2020")) {
                    log.info(`CarPartMapper :: Handling Polestar/Polerstar typo for part ${it.id}`)
                    carTemplate.visualParts.push(it)
                }
                else if (it.path.includes("nissan_gtrnismo_2017") && carTemplate.path.includes("nissan_gtr_2017")) {
                    log.info(`CarPartMapper :: Handling GT-R Nismo part separation for part ${it.id}`)
                    carTemplate.visualParts.push(it)
                }
            })
        }

        return context
    }
}
