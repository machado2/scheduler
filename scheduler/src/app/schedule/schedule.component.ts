import { Component, AfterViewInit } from '@angular/core';
import { ConfigurationService } from '../configuration.service';
import { ScheduleService } from '../schedule.service';
import { Result } from '../result';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.less']
})
export class ScheduleComponent implements AfterViewInit {

  constructor(private scheduleService: ScheduleService) { }

  results: Result[] = [];

  displayedColumns: string[] = ['weekday', 'date', 'name'];

  ngAfterViewInit(): void {
    this.scheduleService.results.subscribe((results) => {
      this.results = results;
    });
  }

}
