import { DateTime } from 'luxon';

export class Parameters {
    startingDate: DateTime = DateTime.now();
    numberOfDays: number = 7;
    numberOfShifts: number = 3;
}