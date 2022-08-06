import { Configuration } from "./configuration";
import { GeneticSearch } from "./geneticsearch";
import { HillClimbingSearch } from "./hillClimbingSearch";
import { RecursiveSearch } from "./recursivesearch";

export const maxpop = 100;
export const mutationRate = 0.01;

export function createSearch(config: Configuration) {
    return new HillClimbingSearch(config);
    // return new RecursiveSearch(config);
    // return new GeneticSearch(config);

}