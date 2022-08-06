import { Result } from './result';
import { Rule } from './rule'

export class DontRepeatSundaysRule implements Rule {

    check(previousShifts: Result[], newshift: Result): boolean {
        if (newshift.date.weekday != 7) {
            return false;
        }
        const previoussundays = previousShifts
            .filter(x =>
                x.date.weekday == 7
                && x.person == newshift.person
                && newshift.date.diff(x.date, 'days').days <= 22
            ).length;
        return previoussundays >= 2;
    }
}
