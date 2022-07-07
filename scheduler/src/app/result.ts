import { DateTime } from 'luxon';
import { Person } from './person';

export class Result {
    constructor(public date: DateTime, public person: Person) {

    }
}