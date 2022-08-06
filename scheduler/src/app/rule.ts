import { Person } from "./person";
import { Result } from "./result";

export interface Rule {

    check(previousShifts: Result[], newshift: Result): boolean;

}