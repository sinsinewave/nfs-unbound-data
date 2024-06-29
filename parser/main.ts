import { log     } from "./util/Log.js"

import { CarScanner     } from "./scanner/CarScanner.js"
import { CarPartScanner } from "./scanner/CarPartScanner.js"
import { CarPartMapper  } from "./mapper/CarPartMapper.js"

import { Context } from "./Context.js"

let util = require('util')

async function main(args) {
    log.level = 1

    let globalContext = new Context()

    log.info("Main :: Initialising")
    log.dbug("Main :: Debug logging enabled")
    globalContext = await CarScanner.scan(args[2], globalContext)
    globalContext = await CarPartScanner.scan(args[2], globalContext)
    globalContext = await CarPartMapper.map(globalContext)

}

main(process.argv)
