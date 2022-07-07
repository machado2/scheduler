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
        let date = config.startingDate;
        const newResults = [];
        for (var i = 0; i < config.numberOfDays; i++)
        {
          const person = config.people[Math.floor(Math.random() * config.people.length)];
          newResults.push(new Result(date, person));
          date = date.plus({ days : 1});
        }
        this.results.next(newResults);
      });
   }
}
