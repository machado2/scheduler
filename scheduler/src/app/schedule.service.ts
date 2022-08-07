import { Injectable } from '@angular/core';
import { ConfigurationService } from './configuration.service';
import { Result } from './result';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DateTime } from 'luxon';

class Shift {
  constructor(
    public date: string,
    public shift: number,
    public id_person: string,
    public problem: boolean) { }
}

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  private results = new BehaviorSubject<Result[] | null>(null);
  getResults() {
    return this.results;
  }

  constructor(configurationService: ConfigurationService, private http: HttpClient) {
    configurationService.getConfiguration()
      .subscribe(config => {
        this.http.post("/solve", config)
          .subscribe(x => {
            const r = x as Shift[];
            const results = r.map(a => new Result(DateTime.fromISO(a.date), a.shift, config.people.filter(p => p.id == a.id_person)[0]));
            this.results.next(results);
          });
      });
  }
}
