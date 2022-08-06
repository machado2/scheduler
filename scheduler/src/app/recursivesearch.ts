import { Configuration } from './configuration'
import { Solution, createRandomSolution } from './solution';
import { Search } from './search'
import { maxpop } from './constants';
import { lastItem, randomElement, shuffle } from './array';
import { Result } from './result';
import { Person } from './person';
import { SubscribableOrPromise } from 'rxjs';

export class RecursiveSearch extends Search {

  totalShifts: number;
  bestFound: Solution;
  testedpaths: number = 0;

  constructor(private config: Configuration) {
    super();
    this.stopped = true;
    this.totalShifts = config.parameters.numberOfDays * config.parameters.numberOfShifts;
    const b = this.findBest();
    this.bestFound = new Solution(this.config, b.results);
    //this.bestFound = this.findBest();
  }

  private nextShift(results: Result[], p: Person) {
    const last = lastItem(results);
    let nextDay;
    let nextShift;
    if (last) {
      if ((last.shift + 1) >= this.config.parameters.numberOfShifts) {
        nextDay = last.date.plus({ days: 1 });
        nextShift = 0;
      } else {
        nextDay = last.date;
        nextShift = last.shift + 1;
      }
    } else {
      nextDay = this.config.parameters.startingDate;
      nextShift = 0;
    }
    return new Result(nextDay, nextShift, p);
  }

  private addPerson(s: Solution, p: Person): Solution {
    const r = this.nextShift(s.results, p);
    const newResults = s.results.concat([r]);
    return this.findNext(new Solution(this.config, newResults));
  }

  private findNext(s: Solution): Solution {
    if (++this.testedpaths > 1000) {
      return s;
    }
    if (s.results.length >= this.totalShifts) {
      return s;
    }
    if (s.hasProblems) {
      return s;
    }
    const people = shuffle(this.config.people);
    let best = this.addPerson(s, people.pop()!);
    if (!best.hasProblems) {
      return best;
    }
    while (people.length > 0) {
      let test = this.addPerson(s, people.pop()!);
      if (!test.hasProblems) {
        return test;
      }
      if (Solution.compare(test, best) < 0) {
        best = test;
      }
    }
    return best;
  }

  private findBest(): Solution {
    const s = new Solution(this.config, []);
    return this.findNext(s);
  }

  public Iterate(): void {
    // this.bestFound = this.findBest();
  }

}