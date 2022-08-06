import { Injectable } from '@angular/core';
import { ConfigurationService } from './configuration.service';
import { Result } from './result';
import { BehaviorSubject, debounceTime, Observable } from 'rxjs';
import { Search } from './search';
import { HillClimbingSearch } from './hillClimbingSearch';
import { Solution } from './solution';
import { GeneticSearch } from './geneticsearch';
import { createSearch } from './constants';
import { HttpClient } from '@angular/common/http';
import { Configuration } from './configuration';
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

  private timer: ReturnType<typeof setTimeout> | null = null;
  private stop: boolean = false;
  private search!: Search;

  private _bestFound!: Solution;
  private set bestFound(value: Solution) {
    this._bestFound = value;
    this.results.next(value);
  }
  private get bestFound(): Solution {
    return this._bestFound;
  }

  private results = new BehaviorSubject<Solution | null>(null);
  getResults() {
    //return this.results.pipe(debounceTime(500));
    return this.results;
  }

  iterationCount: number = 0;

  private iterate() {
    this.search!.Iterate();
    //if (Solution.compare(this.search!.bestFound, this.bestFound!) < 0) {
    this.bestFound = this.search!.bestFound;
    //}
    this.iterationCount++;
  }

  private timerTick() {
    if (!this.stop && !this.search.stopped) {
      try {
        this.iterate();
      } finally {
        this.timer = setTimeout(() => this.timerTick());
      }
    }
  }

  private startSearching() {
    if (this.timer != null) {
      clearTimeout(this.timer);
    }
    this.stop = false;
    this.timerTick();
  }

solve(config: Configuration) {
  this.http.post("http://localhost:8080/solve", config)
    .subscribe(x => {
      const r = x as Shift[];
      const results = r.map(a => new Result(DateTime.fromISO(a.date), a.shift, config.people.filter(p => p.id == a.id_person)[0]));
      this.bestFound = new Solution(config, results);
    });
}

constructor(private configurationService: ConfigurationService, private http: HttpClient) {
  configurationService.getConfiguration()
    .subscribe(config => {
      this.iterationCount = 0;
      this.solve(config);
      /*
      this.search = createSearch(config);
      this.bestFound = this.search.bestFound;
      this.startSearching();*/
    });
}
}
