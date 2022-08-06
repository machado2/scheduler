import { Configuration } from './configuration';
import { Result } from './result';
import { Person } from './person';
import { Rule } from './rule';
import { DontRepeatSundaysRule } from './dontrepeatsundaysrule';
import { MinimumPauseBetweenShifts } from './minimumpausebetweenshiftsrule';

class PersonStats {

    private rules: Rule[];
    person: Person;
    totalShiftsWorked: number = 0;

    constructor(private config: Configuration, person: Person) {
        this.person = person;
        this.rules = [
            new DontRepeatSundaysRule(),
            new MinimumPauseBetweenShifts(config)
        ];
    }

    check(previous: Result[], r: Result): void {
        let problem: boolean = false;
        for (let rule of this.rules) 
        {
            problem = problem || rule.check(previous, r);
        }
        r.problem = problem;
        this.totalShiftsWorked++;
    }

}

export class Fitness {

    cost: number;
    readonly problemCount: number;
    shiftCount: number;
    firstProblem: number | null = null;

    public static compare(a: Fitness, b: Fitness) {
        /*
        if (a.firstProblem != null && b.firstProblem != null) {
            const compfirstprob = b.firstProblem - a.firstProblem;
            if (compfirstprob != 0) {
                return compfirstprob;
            }
        }
          */      
        const complen = b.shiftCount - a.shiftCount;
        if (complen != 0) {
            return complen;
        }

        const compProblems = a.problemCount - b.problemCount;
        if (compProblems != 0) {
            return compProblems;
        }

        const compcost = a.cost - b.cost;
        if (compcost != 0) {
            return compcost;
        }
        
        return 0;
    }

    constructor(config: Configuration, s: Result[]) {
        this.shiftCount = s.length;
        let stats: { [id: string]: PersonStats } = {};
        for (let person of config.people) {
            stats[person.id] = new PersonStats(config, person);
        }
        for (let i = 0; i < s.length; i++) {
            const previous = s.slice(0, i);
            const r = s[i];
            r.problem = false;
            stats[r.person.id].check(previous, r);
            if (r.problem && this.firstProblem == null) {
                this.firstProblem = i;
            }
        }
        this.cost = Object.values(stats).reduce((score, stat) => score + stat.totalShiftsWorked * stat.totalShiftsWorked, 0);
        this.problemCount = s.filter(r => r.problem).length;
    }

}

