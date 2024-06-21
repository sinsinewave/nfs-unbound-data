export class Log {
    level : number = 1

    private d = new Date()
    private print (
        text   : any,
        colour : number,
        label  : string
    ) {
        this.d = new Date()
        var timeString = String(this.d.getHours()  ).padStart(2, '0')
                 + ":" + String(this.d.getMinutes()).padStart(2, '0')
                 + ":" + String(this.d.getSeconds()).padStart(2, '0')
        console.log(`\x1b[1;37;100m ${timeString} \x1b[1;30;4${colour}m ${label} \x1b[0m ${text}`)
    }

    dbug (text : any) { if (this.level <= 0) { this.print(text, 4, "DBUG") }}
    info (text : any) { if (this.level <= 1) { this.print(text, 2, "INFO") }}
    warn (text : any) { if (this.level <= 2) { this.print(text, 3, "WARN") }}
    fail (text : any) { if (this.level <= 3) { this.print(text, 1, "FAIL") }}
}

export const log: Log = new Log()
