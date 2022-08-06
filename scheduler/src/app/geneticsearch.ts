import { Configuration } from './configuration'
import { Solution, createRandomSolution } from './solution';
import { Search } from './search'
import { Result } from './result';
import { maxpop } from './constants'

export class GeneticSearch extends Search {

    bestFound: Solution;

    population: Solution[] = [];

    constructor(private config: Configuration) {
        super();
        this.bestFound = createRandomSolution(config);
    }

    select(): Solution {
        const pop = this.population;
        const index = pop.length - Math.floor(Math.sqrt(Math.random() * pop.length * pop.length)) - 1;
        return pop[index];
    }

    cross(a: Solution, b: Solution): Solution {
        const newResults: Result[] = [];
        for (let i = 0; i < a.results.length; i++) {
            const r = Math.random() < 0.5 ? a.results[i] : b.results[i];
            newResults.push(new Result(r.date, r.shift, r.person));
        }
        return new Solution(this.config, newResults);
    }

    newSolution() {
        /*
        const parentA = this.select();
        const parentB = this.select();
        const newBorn = this.cross(parentA, parentB).mutate();
        return newBorn;
        */
        return this.select().mutate();
    }

    public Iterate(): void {
        const pop = this.population;
        if (pop.length < maxpop) {
            while (pop.length < maxpop) {
                pop.push(createRandomSolution(this.config));
            }
            pop.sort(Solution.compare);
        }
        const newpop: Solution[] = [];
        while (newpop.length < maxpop) {
            newpop.push(this.newSolution());
        }
        newpop.sort(Solution.compare);
        const bestInPop = newpop[0];
        if (Solution.compare(bestInPop, this.bestFound) < 0) {
            this.bestFound = bestInPop;
        }
        this.bestFound = bestInPop;
        this.population = newpop;
    }


}