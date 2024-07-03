import { CarVisualPart } from "../data/CarVisualPart.js"
import { PartType      } from "../data/CarVisualPart.js"

import { Context } from "../Context.js"

import { log     } from "../util/Log.js"
import { walkDir } from "../util/Files.js"

let fs     = require("fs")
let xml2js = require("xml2js")
let util   = require("util")

export class CarPartScanner {
    static async scan(
        context : Context
    ) : Promise<Context> {
        let path = context.args.dataPath
        return this.scanItems(path, context)
    }


    static async scanItems(
        path    : string,
        context : Context
    ): Promise<Context> {
        // Locate car part XMLs and directories, with some filtering
        log.info("CarPartScanner :: Looking for item files")
        let fileList = walkDir(
            path,
            (it : string): boolean => {
                return /^car_[0-9a-z]+_[0-9a-z]+_\d{4}_[a-z]+_set[a-z0-9]+\.xml$/gmi.test(it) || (it.toLowerCase().startsWith("shared_") && it.endsWith(".xml"))
            },
            (it : string): boolean => {
                // Ignore secondhand vehicles, like in the car scan, we aren't interested in that
                return it.includes("items") && !it.includes("secondhand_vehicles")
            }  
        )

        log.info(`CarPartScanner :: Found ${fileList.files.length} item XMLs in ${fileList.dirs.length} directories`)

        for (let file of fileList.files) {
            // Read part info
            let data: string = ""
            log.dbug(`CarPartScanner :: Reading ${file}`)
            try { data = fs.readFileSync(file, "UTF-8") }
            catch(err) { log.warn(`CarPartScanner :: Failed to read ${file} : ${err}`); continue }

            log.dbug("CarPartScanner :: Parsing XML")
            let xmlObj = await xml2js.parseStringPromise(data)
            let itemData = xmlObj[Object.keys(xmlObj)[0]]

            let part = new CarVisualPart(
                file,
                Number(itemData.Id[0].ItemDataId[0].Id[0]),
                file.includes("shared_") ? "shared" : file.split("_").at(-1).split(".")[0].replace(/^(set)/, "")
            )

            // Figure out ignoreUI flag
            // For some reason i feel like this is needlessly convoluted
            try {
                part.flags.ignoreUI = itemData.ItemTags.filter((it) => {
                    if (it.member === undefined) { return false }
                    return true
                }).map((it) => {
                    return it.member
                }).filter((it) => {
                    return it.length > 0 && it.filter((jt) => {
                        return jt._.includes("ignoreui")
                    }).length > 0
                }).length > 0
            }
            catch {
                log.warn(`CarPartScanner :: Unable to determine ignoreui flag for ${file.split("/").at(-1)}`)
            }

            // Other flags
            part.flags.purchasable = (itemData.Purchasable[0] == "True" ? true : false)
            part.flags.shared      = file.includes("shared_")

            // Dig out part type from filename
            // I hate Criterion's naming scheme (or lack thereof) so fucking much
            // Like, just, why
            // Learn what a consistency is, thank you very much
            // (And a case-sensitive filesystem)
            let typeString = ""
            if (file.toLowerCase().split("/").at(-1).includes("shared_")) {
                // Shared parts have their type in a different spot of the filename
                if (
                    file.toLowerCase().endsWith("_r.xml")
                ||  file.toLowerCase().endsWith("_f.xml")
                ||  file.toLowerCase().endsWith("_fr.xml")
                ||  file.toLowerCase().endsWith("_rr.xml")
                ||  file.toLowerCase().endsWith("_fl.xml")
                ||  file.toLowerCase().endsWith("_rl.xml")
                ) {
                    // Most need rear/front information appended from the end of the filename too
                    typeString = `${
                        file.split("/").at(-1).split("_")[1]
                    }${
                        file.split("/").at(-1).split("_").at(-1).split(".")[0]
                    }`
                }
                else {
                    typeString = file.split("/").at(-1).split("_")[1]
                }
            }
            else {
                // Non-shared parts are more trivial
                typeString = file.split("_").at(-2)
            }
            part.setTypeAsString(typeString)

            if (part.type == PartType.INTERNAL_UNKNOWN) { 
                log.warn(`CarPartScanner :: Unable to determine part type (${typeString.toLowerCase()}) for ${file.split("/").at(-1)} (${part.id})`)
            }
            
            context.carVisualParts.push(part)
        }

        return context
    }
}
