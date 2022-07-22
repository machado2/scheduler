import { DateTime } from 'luxon';
import { Person } from './person';

export class Result {
    constructor(public date: DateTime, public shift: number, public person: Person) {

    }
}