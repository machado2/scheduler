import { Component, AfterViewInit } from '@angular/core';
import { ConfigurationService } from '../configuration.service';
import { ScheduleService } from '../schedule.service';
import { Result } from '../result';
import { DateTime } from 'luxon';
import { Solution } from '../solution';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.less']
})
export class ScheduleComponent implements AfterViewInit {

  constructor(public scheduleService: ScheduleService) { }

  solution: Solution | null = null;

  iterationsTaken: number = 0;

  get results(): Result[] {
    return this.solution?.results ?? [];
  }

  displayedColumns: string[] = ['weekday', 'date', 'shift', 'name'];

  ngAfterViewInit(): void {
    this.scheduleService.getResults().subscribe((s) => {
      this.solution = s;
      this.iterationsTaken = this.scheduleService.iterationCount;
    });
  }

}
