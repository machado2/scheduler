import { Component, OnInit } from '@angular/core';
import { DateTime } from 'luxon';
import { ConfigurationService } from '../configuration.service';

@Component({
  selector: 'app-configform',
  templateUrl: './configform.component.html',
  styleUrls: ['./configform.component.less']
})
export class ConfigformComponent implements OnInit {

  constructor(private configurationService: ConfigurationService) { }

  ngOnInit(): void {
  }

  startingDate: DateTime = DateTime.now();

  numberOfDays: number = 7;

  configChanged(): void {
    this.configurationService.setParameters(this.startingDate, this.numberOfDays);
  }


}
