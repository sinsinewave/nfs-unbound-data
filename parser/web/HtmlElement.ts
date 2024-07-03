import assert = require("assert")

export class HtmlElement {
    attrs = {
        class : [],
        id    : ""
    }
    depth          : number        = 0
    children       : HtmlElement[] = []
    private isVoid : boolean       = false
    body           : string        = ""

    constructor(public tag: string) {
        if (["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"].includes(tag)) {
            this.isVoid = true
        }
    }

    withAttrs(attrs : {string : string}): HtmlElement {
        for (let a in attrs) {
            this.attrs[a] = attrs[a]
        }
        return this
    }

    withClass(...classes : string[]): HtmlElement {
        for (let c of classes) {
            if (!this.attrs.class.includes(c)) {
                this.attrs.class.push(c)
            }
        }
        return this
    }

    withId(id: string): HtmlElement {
        this.attrs.id = id
        return this
    }

    private refreshDepth() {
        for (let child of this.children) {
            if (child.depth == this.depth) {
                child.depth += 1
                child.refreshDepth()
            }
        }
    }

    withChildren(...children : HtmlElement[]): HtmlElement {
        assert(!this.isVoid)
        for (let child of children) {
            child.depth = this.depth + 1
            child.refreshDepth()
            this.children.push(child)
        }
        return this
    }
    
    withBody(body : string): HtmlElement {
        assert(!this.isVoid)
        this.body = body
        return this
    }

    toString(): string {
        let attrString = ""
        for (let attr in this.attrs) {
            if (this.attrs[attr].length > 0) {
                attrString += ` ${attr}="${this.attrs[attr]}"`
            }
        }

        let res = `${" ".repeat(4*this.depth)}<${this.tag}${attrString}`

        if (this.isVoid) {
            return res + "/>"
        }
        else {
            res += ">\n"
            if (this.body.length > 0) { res += `${" ".repeat(4*(this.depth+1))}${this.body}\n` }
            for (let child of this.children) {
                res += `${child.toString()}\n`
            }
            res += `${" ".repeat(4*this.depth)}</${this.tag}>`
            return res
        }
    }
}
