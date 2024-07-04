import { log     } from "../util/Log.js"
import { walkDir } from "../util/Files.js"

import { CarTemplate } from "../data/CarTemplate.js"
import { Car         } from "../data/Car.js"

import { Context } from "../Context.js"

let fs     = require("fs")
let xml2js = require("xml2js")
let util   = require("util")

export class CarScanner {
    static async scan(
        context : Context
    ): Promise<Context> {
        let path = context.args.dataPath
        // Locate car XMLs and directories, with some filtering
        log.info("CarScanner :: Looking for files")
        let fileList = walkDir(
            path,
            (it : string): boolean => {
                return /^(cop)?car_[0-9a-z]+_[0-9a-z]+_\d{4}(_(cop|icon))?\.xml$/gmi.test(it)
            },
            (it : string): boolean => {
                // filter to items dir, ignore secondhand vehicles, contains nothing of relevance to this tool
                return it.includes("items") && !it.includes("secondhand_vehicles")
            }  
        )

        log.info(`CarScanner :: Found ${fileList.files.length} car XMLs in ${fileList.dirs.length} directories`)
        log.info("CarScanner :: Sorting results")

        // Organise cars per directory for easier processing
        let filesByDir = {}
        for (let dir of fileList.dirs) {
            log.dbug(`CarScanner :: ${dir}`)
            filesByDir[dir] = fileList.files.filter((it : string): boolean => {
                return it.startsWith(dir)
            })
            filesByDir[dir].forEach((it, idx, array) => { idx === (array.length-1) ? log.dbug(`CarScanner :: └─ ${it}`) : log.dbug(`CarScanner :: ├─ ${it}`) })
        }

        log.info("CarScanner :: Parsing results into objects")
        // Parse into CarTemplates and Cars
        for (let dir in filesByDir) {
            // Carve out brand, model, and year, and make a CarTemplate
            let template = new CarTemplate(
                dir,
                dir.split("/").at(-1)!.split("_")[1],
                dir.split("/").at(-1)!.split("_")[2],
                +dir.split("/").at(-1)!.split("_")[3]
            )

            // Fill in car variants
            for (let file of filesByDir[dir]) {
                // load ID from car XML
                let data: string = ""
                log.dbug(`CarScanner :: Reading ${file}`)
                try { data = fs.readFileSync(file, "UTF-8") }
                catch(err) { log.warn(`CarScanner :: Failed to read ${file} : ${err}`); continue }
                
                log.dbug("CarScanner :: Parsing XML")
                let xmlObj = await xml2js.parseStringPromise(data)

                let car = new Car(
                    file,
                    Number(xmlObj.RaceVehicleItemData.Id[0].ItemDataId[0].Id[0]),
                    file.toLowerCase().split("/").at(-1)!.split("_")[2] + (file.toLowerCase().includes("cop") ? "_cop" : ""),
                    file.toLowerCase().split("/").at(-1)!.split("_")[3]
                )

                template.cars.push(car)
                car.template = template
            }
            context.carTemplates.push(template)
        }

        return context
    }
}
