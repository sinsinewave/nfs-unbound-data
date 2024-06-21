import { log     } from "./util/Log.js"
import { walkDir } from "./util/Files.js"

import { VisualCarPart } from "./data/VisualCarPart.js"
import { CarTemplate   } from "./data/CarTemplate.js"

import { CarScanner } from "./scanner/CarScanner.js"

import { Context } from "./Context.js"

async function main() {
    log.level = 1

    let globalContext = new Context()

    log.info("Main :: Initialising")
    log.dbug("Main :: Debug logging enabled")
    globalContext = await CarScanner.scan("/home/sigma1/Projects/Code/NFS Unbound EBX Parser/Unbound_V6", globalContext)


    console.log(globalContext)
}

main()
