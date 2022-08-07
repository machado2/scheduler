import { DateTime } from 'luxon';
import { Person } from './person';

export class Result {
    constructor(
        public readonly date: DateTime, 
        public readonly shift: number, 
        public readonly person: Person) {

    }

    public Clone(newPerson: Person = this.person) {
        return new Result(this.date, this.shift, newPerson);
    }

}