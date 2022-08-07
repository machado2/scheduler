import { Component, AfterViewInit } from '@angular/core';
import { ScheduleService } from '../schedule.service';
import { Result } from '../result';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.less']
})
export class ScheduleComponent implements AfterViewInit {

  constructor(public scheduleService: ScheduleService) { }

  results: Result[] = [];

  displayedColumns: string[] = ['weekday', 'date', 'shift', 'name'];

  ngAfterViewInit(): void {
    this.scheduleService.getResults().subscribe((r) => {
      this.results = r ?? [];
    });
  }

}
