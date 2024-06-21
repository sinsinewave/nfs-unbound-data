import { readdirSync } from "fs"
import { lstatSync   } from "fs"
import { resolve     } from "path"
import { log         } from "./Log.js"


/**
 * Recursively scans a directory for subdirectories and files
 *
 * @param       root            Root directory to scan from
 * @param       fileFilter      Filter function applied to file names
 * @param       dirFilter       Filter function applied to directory names
 * @param       __result        Internal, do not use
 *
 * @returns                     Object containing lists of found files and directories
 */
export function walkDir(
    root       : string,
    fileFilter : (it : string) => boolean = (it : string) : boolean => { return true },
    dirFilter  : (it : string) => boolean = (it : string) : boolean => { return true },
    __result   : { dirs  : string[], files : string[] } = { dirs  : [], files : [] }
): { dirs  : string[], files : string[] } {
    readdirSync(root).forEach(it => {
        if (isDir(resolve(root, it)) && dirFilter(resolve(root, it))) {
            walkDir(resolve(root, it), fileFilter, dirFilter, __result)
        }
        else if (fileFilter(it) && dirFilter(root)) {
            __result.files.push(resolve(root, it))
            if (!__result.dirs.includes(root)) {
                __result.dirs.push(root)
            }
        }
    })
    return __result
}


/**
 * Checks whether a path is a directory
 *
 * @param       path    Path that shall be checked
 *
 * @returns             True if path is a directory, False otherwise
 */ 
export function isDir(path : string) : boolean {
    return lstatSync(path).isDirectory()
}
