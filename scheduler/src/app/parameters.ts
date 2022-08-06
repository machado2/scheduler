import { DateTime } from 'luxon';

export class Parameters {
    startingDate: DateTime = DateTime.now();
    numberOfDays: number = 30;
    numberOfShifts: number = 3;
}