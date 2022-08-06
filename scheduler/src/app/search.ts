import { Solution } from "./solution";

export abstract class Search {
    stopped: boolean = false;
    abstract get bestFound(): Solution;
    abstract Iterate(): void;
}