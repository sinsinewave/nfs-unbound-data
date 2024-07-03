import { log } from "./util/Log.js"

import { CarScanner      } from "./scanner/CarScanner.js"
import { CarPartScanner  } from "./scanner/CarPartScanner.js"
import { CarPartMapper   } from "./mapper/CarPartMapper.js"
import { CarHtmlCompiler } from "./web/CarHtmlCompiler.js"

import { Context } from "./Context.js"

let util = require('util')

async function main(args) {
    log.level = 1

    let globalContext = new Context()
    globalContext.args.dataPath = args[2]
    globalContext.args.outPath = args[3]

    log.info("Main :: Initialising")
    log.dbug("Main :: Debug logging enabled")
    globalContext = await CarScanner.scan(globalContext)
    globalContext = await CarPartScanner.scan(globalContext)
    globalContext = await CarPartMapper.map(globalContext)
    globalContext = await CarHtmlCompiler.compile(globalContext)
    
}

main(process.argv)
