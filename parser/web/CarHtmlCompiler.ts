import { log } from "../util/Log.js"
import { Eta } from "eta";

import { CarVisualPart } from "../data/CarVisualPart.js"
import { Car           } from "../data/Car.js"

import { Context } from "../Context.js"

let fs   = require("fs")
let path = require("path")

const eta = new Eta({ views : path.join(__dirname, "templates"), autoTrim: ["slurp", false] })

export class CarHtmlCompiler {
    static compile(context: Context): Context {
        log.info("CarHtmlCompiler :: Building HTML documents for cars")

        for (let template of context.carTemplates) {
            let types = []
            let sets  = []
            template.visualParts.forEach((it) => {
                // Create lists of all unique sets and types to be used later
                if (!types.includes(it.type)) {
                    types.push(it.type)
                }
                if (!sets.includes(it.set.toLowerCase()) && it.set.toLowerCase() != "shared") {
                    sets.push(it.set.toLowerCase())
                }
            })

            types = types.sort()
            sets  = sets.sort()

            // Sort parts by set for templating
            let partsBySet = {}
            for (let set of sets) {
                partsBySet[set] = []
                for (let type of types) {
                    partsBySet[set].push(
                        template.visualParts.filter((it) => {
                            return (it.set.toLowerCase() == set && it.type == type)
                        })[0]
                    )
                }
            }

            

            // Render main table with Eta
            let document = eta.render("./carPartTable", {
                headers : types,
                sets    : sets,
                parts   : partsBySet
            })

            // Write table HTML files
            let outFile = path.join(context.args.outPath, `${template.getName()}.html`)
            log.info(`CarHtmlCompiler :: Writing ${outFile}`)
            fs.writeFileSync(
                outFile,
                document, 
                { flag: 'w' }
            )
        }

        return context
    }
}
