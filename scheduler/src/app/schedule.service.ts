import { Injectable } from '@angular/core';
import { ConfigurationService } from './configuration.service';
import { Result } from './result';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  results: BehaviorSubject<Result[]> = new BehaviorSubject<Result[]>([]);

  constructor(private configurationService: ConfigurationService) {
    configurationService.getConfiguration()
      .subscribe(config => {
        const params = config.parameters;
        const people = config.people;
        let date = params.startingDate;
        const newResults = [];
        for (var i = 0; i < params.numberOfDays; i++) {
          for (var shift = 0; shift < params.numberOfShifts; shift++) {
            const person = people[Math.floor(Math.random() * people.length)];
            newResults.push(new Result(date, shift, person));
          }
          date = date.plus({ days: 1 });
        }
        this.results.next(newResults);
      });
  }
}
