import { Configuration } from './configuration'
import { Solution, createRandomSolution } from './solution';
import { Search } from './search'
import { maxpop } from './constants';

export class HillClimbingSearch extends Search {

  bestFound: Solution;

  constructor(private config: Configuration) {
    super();
    this.bestFound = createRandomSolution(config);
  }

  public Iterate(): void {
    let current = this.bestFound.mutate();
    for (let i = 0; i < 100; i++) {
      if (Solution.compare(current, this.bestFound) < 0) {
        this.bestFound = current;
      }
      current = current.mutate();
    }
  }

}