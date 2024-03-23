from log import log

import json

import xml.etree.ElementTree as xml

from re  import match as regex
from sys import argv
from os  import path
from os  import mkdir
from os  import listdir
from os  import walk    as walkdir


def main():

    CARS = []

    log.info("Initialising")

    # args shorthand for convenience
    args = argv[1:]
    log.dbug(f"Got arguments: {', '.join(args)}")

    dirItems = path.join(args[0], "items")


    # check data dump directory validity
    if not path.exists(args[0]) or not path.isdir(args[0]):
        log.fail(f"Data dump path invalid: {args[0]}")
        exit(255)
    else:
        log.info(f"Reading EBX dump from: {args[0]}")


    log.info(f"Starting car scan")
    # all cars are under items/car_<brand>_<model>_<year>, therefore this scan is relatively simple
    # start by looping through items and filtering to car dirs
    # this is one of the few places where the directory structure *can* mostly be trusted
    for dirCar in filter(
        lambda d: regex(r"^car_.*_.*_\d{4}$", d.lower()),
        listdir(dirItems)
    ):
        # Locate car supertype/base model and add to list of cars
        # Most reliable method is based on directory (mostly)
        # TODO: Hunt down any other cursed bullshit

        # Polestar/Polerstar typo mitigation
        if dirCar.split("_")[1] == "polerstar":
            log.dbug("Accounting for Polestar/Polerstar special case")
            continue
        # GT-R/GT-R Nismo dir separation mitigation
        if dirCar.split("_")[2] == "gtrnismo":
            log.dbug("Accounting for GT-R/GT-R Nismo special case")
            continue
        # 9912 GTS situation mitigation
        if dirCar.split("_")[2] == "9912gts":
            continue

        if  not (dirCar.split("_")[2] == "carreras" and int(dirCar.split("_")[3]) == 2014) \
        and not (dirCar.split("_")[2] == "9912gtrs" and int(dirCar.split("_")[3]) == 2018):
            CARS.append({
                "brand" : dirCar.split("_")[1].lower(),
                "year"  : int(dirCar.split("_")[3].lower()),
                "model" : dirCar.split("_")[2].lower(),
                "variants" : [],
                "unscopedParts" : {}
            })
        else:
            # By the goddess this is ugly but i can't think of a better way
            if "9912gtrs" not in map(
                lambda c: c["model"],
                CARS
            ):
                CARS.append({
                    "brand" : "porsche",
                    "model" : "9912gtrs",
                    "year"  : 2018,
                    "variants" : [],
                    "unscopedParts" : {}
                })


        for fileCar in filter(
            lambda f: regex(r"^(cop)?car_.*_.*_\d{4}(_icon|_cop)?.xml$", f.lower()),
            listdir(path.join(dirItems, dirCar))
        ):
            log.dbug(f"Reading {fileCar}")
            treeCar = xml.fromstring(
                  "<root>"
                + open(path.join(dirItems, dirCar, fileCar), "r").read()
                + "</root>"
            )
           
            newCarVar = {
                "id"           : int(treeCar.find("RaceVehicleItemData/Id/ItemDataId/Id").text.strip("0x"), 16),
                "model"        : fileCar.split("_")[2].lower(),
                "year"         : int(fileCar.split("_")[3].strip(".xml")),
                "isCop"        : fileCar.lower().startswith("copcar_"),
                "purchaseable" : treeCar.find("RaceVehicleItemData/Purchasable").text == "True",
                "scope"        : list(map(lambda i: int(i.text.strip("0x"), 16), treeCar.findall("RaceVehicleItemData/SortedScope/member/ItemDataId/Id"))),
                "unscopedParts": {}
            }

            # Special cases for cop-only cars
            if newCarVar["model"] in [
                "explorer",
                "crownvictoriapoliceinterceptor",
                "armouredtruck",
                "chargersrt8"
            ]:
                newCarVar["isCop"] = True

            # 9912 GTS situation mitigation
            if  not (dirCar.split("_")[2] == "carreras" and int(dirCar.split("_")[3]) == 2014) \
            and not (dirCar.split("_")[2] == "9912gtrs" and int(dirCar.split("_")[3]) == 2018):
                CARS[-1]["variants"].append(newCarVar)
            else:
                log.dbug("Accounting for 991 GTS special case")
                list(filter(
                    lambda c: c["brand"] == "porsche" and c["model"] == "9912gtrs",
                    CARS
                ))[0]["variants"].append(newCarVar)


        if len(CARS[-1]["variants"]) == 0:
            log.warn(f"{CARS[-1]['brand']} {CARS[-1]['model']} has no variants, skipping")
            del CARS[-1]
            continue
        log.info(f"Found {CARS[-1]['brand']} {CARS[-1]['model']} with {len(CARS[-1]['variants'])} variants")

    log.info(f"Scanned {len(CARS)} cars")

    # Insert generic "shared car" at end
    CARS.append({
        "brand"    : "generic",
        "model"    : "sharedparts",
        "year"     : 0,
        "variants" : []
    })

    log.info(f"Starting part scan phase 1")
    # Recurse into the items dir
    # And locate all parts with their IDs
    allParts = {}
    tmpParts = {}
    sharedParts = {}
    for (root, dirs, files) in walkdir(dirItems):
        # Locate car-specific parts
        for xmlFile in filter(
            lambda p: regex(r"^car_.*_.*_\d{4}_[a-z]+_set[a-z0-9]+\.xml$", p.lower()),
            files
        ):
            log.dbug(f"Reading {xmlFile}")
            partTree = xml.fromstring(
                  "<root>"
                + open(path.join(root, xmlFile), "r").read()
                + "</root>"
            )
            tmpParts[int(partTree.find("*/Id/ItemDataId/Id").text.strip("0x"), 16)] = {
                "path"         : path.join(root, xmlFile),
                "type"         : xmlFile.split("_")[4].lower(),
                "set"          : xmlFile.split("_")[5].replace(".xml", "").lower(),
                "id"           : int(partTree.find("*/Id/ItemDataId/Id").text.strip("0x"), 16),
                "purchaseable" : treeCar.find("*/Purchasable").text == "True",
                "scoped"       : True,
                "tags"         : list(map(lambda t: t.text.split(" ")[1].split("/")[-1], partTree.findall("*/ItemTags/member")))
            }

        # Locate shared parts
        for xmlFile in filter(
            lambda p: regex(r"^shared_[a-z]+_.*\.xml$", p.lower()),
            files
        ):
            log.dbug(f"Reading {xmlFile}") 
            partTree = xml.fromstring(
                  "<root>"
                + open(path.join(root, xmlFile), "r").read()
                + "</root>"
            )
            partType = xmlFile.split("_")[1].lower()
            if xmlFile.lower().endswith("fl.xml") \
            or xmlFile.lower().endswith("fr.xml"):
                partType += "f" 
            if xmlFile.lower().endswith("rl.xml") \
            or xmlFile.lower().endswith("rr.xml"):
                partType += "r"
            if xmlFile.lower().endswith("_r.xml"):
                partType += "r"
            if xmlFile.lower().endswith("_f.xml"):
                partType += "f"
            sharedParts[int(partTree.find("*/Id/ItemDataId/Id").text.strip("0x"), 16)] = {
                "path"         : path.join(root, xmlFile),
                "type"         : partType,
                "name"         : "_".join(xmlFile.split("_")[2:]).lower().replace(".xml", ""),
                "id"           : int(partTree.find("*/Id/ItemDataId/Id").text.strip("0x"), 16),
                "purchaseable" : treeCar.find("*/Purchasable").text == "True",
                "scoped"       : True,
                "set"          : "shared",
                "tags"         : list(map(lambda t: t.text.split(" ")[1].split("/")[-1], partTree.findall("*/ItemTags/member")))
            }


    log.info("Mapping parts to cars based on IDs")
    mappedParts = {}

    for car in CARS:
        for var in car["variants"]:
            localTmpParts = {}
            for i in var["scope"]:
                if i in tmpParts.keys():
                    localTmpParts[i] = tmpParts[i]
                    mappedParts[i] = tmpParts[i]
                    mappedParts[i]["car"] = var
            var["scope"] = localTmpParts

    log.info(f"{len(tmpParts) - len(mappedParts)} parts remaining")

    log.info("Mapping parts to cars based on name")
    for part in filter(
        lambda p: p["id"] not in mappedParts.keys(),
        tmpParts.values()
    ):
        if regex(r"^car_.*_.*_\d{4}_[a-z]+_set[a-z0-9]+\.xml$", part["path"].split("/")[-1].lower()):
            partName = part["path"].lower().split("/")[-1].replace(".xml", "")
            carBrand = partName.split("_")[1]
            carModel = partName.split("_")[2]

            for car in filter(
                lambda c: c["brand"] == carBrand,
                CARS
            ):
                # First check if model is a variant
                if carModel in map(
                    lambda v: v["model"],
                    car["variants"]
                ):
                    list(filter(
                        lambda v: v["model"] == carModel,
                        car["variants"]
                    ))[0]["unscopedParts"][part["id"]] = part
                    mappedParts[part["id"]] = part
                    part["scoped"] = False
                # If not, check if it's unspecific but still maps to a car
                elif car["model"] == "carModel":
                    car["unscopedParts"][part["id"]] = part
                    mappedParts[part["id"]] = part
                    part["scoped"] = False
           
    if len(tmpParts) > len(mappedParts):
        log.warn(f"{len(tmpParts) - len(mappedParts)} parts remain unmapped!")

    log.info(f"{len(mappedParts)} parts mapped")

    CARS[-1]["unscopedParts"] = sharedParts
    log.info(f"{len(sharedParts)} shared parts found")

    allParts = mappedParts | sharedParts

    kt = []
    log.info("Cleaning up part types")
    # Clean up types
    for i,part in allParts.items():
        if part["type"] in ["wheelfl", "wheelfr"]: part["type"] = "wheelf"
        if part["type"] in ["wheelrl", "wheelrr"]: part["type"] = "wheelr"
        if part["type"] in ["fenderschasr"]:       part["type"] = "fenderschassisr"
        if part["type"] in ["fenderschasf"]:       part["type"] = "fenderschassisf"

        if part["type"] in [
            "mirrorbaser",
            "mirrorbasel",
            "bumperrdiffuser",
            "fenderschassisr",
            "fenderschassisf",
            "bumperchassisf",
            "bumperchassisr"
        ]: 
            part["internal"] = True
        else:
            part["internal"] = False

        if part["type"] not in kt: kt.append(part["type"])

    log.dbug(f"Found part types: {', '.join(kt)}")

    ### HTML GENERATOR PHASE ###
    # Why is this a thing? who the hell knows
    # Does it work? hell yeah

    log.info("Generating HTML documents")

    try:
        mkdir("cars")
    except:
        pass

    templates = {
        "header" : lambda titles: f"""
            <tr class="main-header top"><th></th>{''.join(list(map(lambda c: "<th>"+c+"</th>", titles)))}</tr>
        """.strip(),
        "row"    : lambda header, content: f"""
            <tr class="main-row"><th class="main-header left">{header}</th>{''.join(list(map(lambda c: "<td class=\"col\">"+c+"</td>", content)))}</tr>
        """.strip(),
        "item"   : lambda item: f"""
            <div class="subtile">
                <b {"class='cop'" if item['set'].endswith('cop') else ""}>{item['id']}</b>
                <table>
                    <tr>
                        <th>In Scope</th>
                        <td class="{str(item["scoped"]).lower()}">{str(item["scoped"])}</td>
                    </tr>
                    <tr>
                        <th>Purchaseable</th>
                        <td class="{str(item["purchaseable"]).lower()}">{str(item["purchaseable"])}</td>
                    </tr>
                    <tr>
                        <th>IgnoreUI</th>
                        <td class="{str(not "ignoreui" in item["tags"]).lower()}">{"ignoreui" in item["tags"]}</td>
                    </tr>
                </table>
            </div>
        """.strip()
    }

    for car in CARS:

        typedItems = {}
        sets = []

        # This bit is impressively disgusting
        for var in car["variants"]:
            for part in var["scope"].values():
                if part["type"] not in typedItems:
                    typedItems[part["type"]] = []
                typedItems[part["type"]].append(part)
                if part["set"] not in sets:
                    sets.append(part["set"])

            for part in var["unscopedParts"].values():
                if part["type"] not in typedItems:
                    typedItems[part["type"]] = []
                typedItems[part["type"]].append(part)
                if part["set"] not in sets:
                    sets.append(part["set"])

        for part in car["unscopedParts"].values():
            if part["type"] not in typedItems:
                typedItems[part["type"]] = []
            typedItems[part["type"]].append(part)
            if part["set"] not in sets:
                sets.append(part["set"])



        sets.sort()

        sortedTypes = list(typedItems.keys())
        sortedTypes.sort()

        HTML = """
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    background : #111515;
                }
                * {
                    color       : #D1D2CA;
                    font-family : monospace;
                }
                table {
                    border-spacing  : 0;
                    border-collapse : collapse;
                }
                td.true {
                    background : #0BDA51;
                    color      : #25272C;
                }
                td.false {
                    background : #FF355E;
                    color      : #25272C;
                }
                .main {
                    overflow : hidden;
                }
                .main-header th {
                    padding : 3.5pt;
                }
                td {
                    border : 1px solid #000000;
                }
                .main-header {
                    position   : sticky;
                    background : #202225;
                    z-index    : 2;
                }
                tbody tr:nth-of-type(even) th,
                tr.main-header th:nth-of-type(even) {
                    background : #25272C;
                }
                tr.main-header.top {
                    top        : 0;
                }
                th.main-header.left {
                    left       : 0;
                }
                .subtile {
                    display         : flex;
                    flex-direction  : column;
                    justify-content : middle;
                    background      : #000000;
                    box-shadow      : 0 0 15px 0 black;
                    margin          : 3.5pt;
                }
                .subtile b {
                    background    : linear-gradient(to right, #0BDA51, #C1F07C);
                    text-align    : center;
                    color         : #25272C;
                    margin-bottom : 2pt;
                    border-radius : 5pt;
                }
                .subtile b.cop {
                    background    : linear-gradient(to right, #286ACD, #FF355E);
                }
                .subtile tr th {
                    text-align    : left;
                    padding-left  : 5pt;
                    padding-right : 5pt;
                    background    : #25272C;
                }
                .main-row:hover {
                    background : #101212;
                    overflow   : visible;
                }
                .col {
                    position   : relative;
                    background : transparent;
                }
                .col:hover:before {
                    content    : '\00';  
                    height     : 300vh;
                    left       : 0;
                    position   : absolute;  
                    top        : -100vh;
                    z-index    : -1;
                    width      : 100%;
                    background : #101212;
                    overflow   : visible;
                }
            </style>
        </head>
        <body>
            <table class="main">
        """.strip()


        HTML += templates["header"](sortedTypes)

        rows = []
        if car != CARS[-1]:
            for _set in sets:
                rows.append([_set])
                for _type in sortedTypes:
                    filteredItems = list(filter(
                        lambda i: i["set"] == _set,
                        typedItems[_type]
                    ))
                    if len(filteredItems) > 0:
                        rows[-1].append(templates["item"](filteredItems[0]))
                    else:
                        rows[-1].append("")
        else:
            i = 0
            while i < len(sharedParts):
                rows.append(["shared"])
                for _type in sortedTypes:
                    try:
                        rows[-1].append(templates["item"](typedItems[_type][i]))
                    except IndexError:
                        rows[-1].append("")
                i += 1
            

        for row in rows:
            HTML += templates["row"](row[0], row[1:])
            

        HTML += """
            </table>
        </body>
        </html>
        """.strip()

        with open(path.join("cars", str(car["year"])+"_"+car["brand"]+"_"+car["model"]+".html"), "w") as htmlFile:
            htmlFile.write(HTML)

        # Generate car list
        HTML = """
        <!DOCTYPE html>
        <html>
        <head>
            <style>
            body {
                background      : black;
                display         : flex;
                justify-content : center;
                flex-direction  : column;
                align-items     : center;
            }
            body div {
                display         : flex;
                background      : #111515;
                max-width       : 800px;
                width           : 100%;
                justify-content : center;
                flex-direction  : column;
                align-items     : stretch;
                padding         : 15pt;
            }
            * {
                color       : #D1D2CA;
                font-family : monospace;
            }
            .brand {
                margin-bottom : 15pt;
                font-size     : 16pt;
            }
            .carLink:nth-of-type(odd) {
                background : #202225;
            }
            .carLink {
                display         : flex;
                justify-content : space-between;
                padding         : 3.5pt;
                align-items     : center;
                border-radius   : 10pt;
            }
            .carLink:hover {
                background : #303235;
            }
            .carLink:nth-of-type(even):hover {
                background : #25272C;
            }
            .carLink span {
                align-content   : flex-end;
                display         : flex;
                justify-content : flex-end;
                gap             : 5pt 10pt;
                flex-wrap       : wrap;
            }
            .carLink a {
                text-decoration : none;
                flex-grow       : 1;
                min-width       : 225px;
            }
            .varTag {
                margin        : 0px;
                margin-left   : 5pt;
                padding       : 3.5pt;
                background    : linear-gradient(to right, #C1F07C, #0BDA51);
                border-radius : 10pt;
                color         : #25272C;
            }

            .cop {
                background : linear-gradient(to right, #8B9FEE, #FF69B4);
            }

            .none {
                background : transparent;
                color      : #4C4F56;
            }
            </style>
        </head>
        <body>
        <h2>NFS Unbound Car Part Lists</h2>
        """.strip()
        brands = list(set(map(
            lambda c: c["brand"],
            CARS
        )))
        brands.sort()
        for brand in brands:
            HTML += f"<div>"
            HTML += f"<b class='brand'>{brand}</b>"
            for car in filter(
                lambda c: c["brand"] == brand,
                CARS
            ):
                HTML += f"<span class='carLink'>"
                HTML += f"<a href=cars/{car['year']}_{car['brand']}_{car['model']}.html>{car['year']} {car['model']}</a>"
                HTML += f"<span>"
    
                if len(car["variants"]) > 1:
                    for var in car["variants"]:
                        if not var["isCop"]:
                            HTML += f"<p class='varTag'>{var['model']}</p>"
                        else:
                            HTML += f"<p class='varTag cop'>{var['model']} cop</p>"
                else:
                    try:
                        if car["variants"][0]["isCop"]:
                            HTML += f"<p class='varTag cop'>cop only</p>"
                        else:
                            HTML += f"<p class='varTag none'>no variants</p>"
                    except:
                        pass

                HTML += f"</span></span>"
            HTML += "</div>"

        HTML += """
        </body>
        """

        with open("index.html", "w") as htmlFile:
            htmlFile.write(HTML)
main()
