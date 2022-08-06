import { Configuration } from './configuration';
import { Fitness } from './fitness';
import { Result } from './result'
import { mutationRate } from './constants';
import { randomElement, shuffle } from './array';



export class Solution {

    readonly fitness: Fitness;

    public static compare(a: Solution, b: Solution) {
        return Fitness.compare(a.fitness, b.fitness);
    }
    
    get cost() {
        return this.fitness.cost;
    }

    get hasProblems() {
        return this.fitness.problemCount > 0;
    }

    get problemCount(){
        return this.fitness.problemCount;
    }

    get firstProblem() {
        return this.fitness.firstProblem;
    }

    private mutateResult(r: Result) {
        return Math.random() <= mutationRate
            ? r.Clone(randomElement(this.config.people))
            : r.Clone();
    }

    public mutate(): Solution {
        /*
        if (this.hasProblems) {
            const randomProblem = randomElement(this.results.filter(x => x.problem));
            const replacement = randomProblem.Clone(randomElement(this.config.people));
            const newResults = this.results.map(old => old == randomProblem ? replacement : this.mutateResult(old));
            return new Solution(this.config, newResults);
        }
        */
        const newResults = this.results.map(old => this.mutateResult(old));
        return new Solution(this.config, newResults);
    }

    constructor(public readonly config: Configuration, public readonly results: Result[]) {
        this.fitness = new Fitness(config, results);
    }
}

export function createRandomSolution(config: Configuration): Solution {
    const params = config.parameters;
    const people = config.people;
    let date = params.startingDate;
    const newResults = [];
    for (var i = 0; i < params.numberOfDays; i++) {
        for (var shift = 0; shift < params.numberOfShifts; shift++) {
            const person = randomElement(people);
            newResults.push(new Result(date, shift, person));
        }
        date = date.plus({ days: 1 });
    }
    let s = new Solution(config, newResults);

    // try to fix problems
    let firstProblem = s.firstProblem;
    for (;;) {
        if (firstProblem == null) {
            return s;
        }
        let results = s.results.concat([]);
        for (let i = 0; i < 3; i++) {
            results[firstProblem] = results[firstProblem].Clone(randomElement(config.people));
            const ns = new Solution(config, results);
            if (ns.firstProblem == null || ns.firstProblem > firstProblem) {
                s = ns;
                break;
            }
        }
        if (s.firstProblem == null || s.firstProblem <= firstProblem) {
            return s;
        }
        firstProblem = s.firstProblem;
    }
}