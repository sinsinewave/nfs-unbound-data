import { log     } from "./util/Log.js"
import { walkDir } from "./util/Files.js"

import { VisualCarPart } from "./data/VisualCarPart.js"
import { CarTemplate   } from "./data/CarTemplate.js"

import { CarScanner } from "./scanner/CarScanner.js"

import { Context } from "./Context.js"

async function main(args) {
    log.level = 1

    let globalContext = new Context()

    log.info("Main :: Initialising")
    log.dbug("Main :: Debug logging enabled")
    globalContext = await CarScanner.scan(args[2], globalContext)

}

main(process.argv)
