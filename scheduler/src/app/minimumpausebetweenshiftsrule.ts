import { Configuration } from "./configuration";
import { Result } from "./result";
import { Rule } from "./rule";

export class MinimumPauseBetweenShifts implements Rule {
    
    check(previousShifts: Result[], newshift: Result): boolean {

        const filtered = previousShifts.filter(x => x.person == newshift.person).slice(-1);
        if (filtered.length == 0) {
            return false;
        }
        const lastShift = filtered[0];
        const interval = this.shiftsDistance(lastShift, newshift);
        return interval < 2;
    }

    constructor (private config: Configuration) {}

    shiftsDistance(a: Result, b: Result): number {
        const numberOfShifts = this.config.parameters.numberOfShifts;
        const days = b.date.diff(a.date, 'days').days;
        if (days == 0) {
            return b.shift - a.shift;
        }
        const shiftsFirstDay = numberOfShifts - a.shift - 1;
        const shiftsInbetweenDays = (days - 1) * numberOfShifts;
        return shiftsFirstDay + shiftsInbetweenDays + b.shift;
    }

}
