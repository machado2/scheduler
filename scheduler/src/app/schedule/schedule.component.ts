import { Component, AfterViewInit } from '@angular/core';
import { ScheduleService, ScheduleStatus } from '../schedule.service';
import { Result } from '../result';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.less']
})
export class ScheduleComponent implements AfterViewInit {

  constructor(public scheduleService: ScheduleService) { }

  results: (Result[] | ScheduleStatus)  = ScheduleStatus.Idle;

  get dataSource() {
    if (this.results instanceof Array) {
      return this.results;
    }
    return [];
  }

  get isLoading() {
    return this.results == ScheduleStatus.Loading;
  }

  get isNotFound() {
    return this.results == ScheduleStatus.NotFound;
  }

  displayedColumns: string[] = ['weekday', 'date', 'shift', 'name'];

  ngAfterViewInit(): void {
    this.scheduleService.getResults().subscribe((r) => {
      this.results = r;
    });
  }

}
