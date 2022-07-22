import { Component, OnInit } from '@angular/core';
import { DateTime } from 'luxon';
import { ConfigurationService } from '../configuration.service';
import { Parameters } from '../parameters';

@Component({
  selector: 'app-configform',
  templateUrl: './configform.component.html',
  styleUrls: ['./configform.component.less']
})
export class ConfigformComponent implements OnInit {

  constructor(private configurationService: ConfigurationService) { }

  ngOnInit(): void {
    this.configurationService.getConfiguration().subscribe((config) => {
      this.parameters = config.parameters;
    });
  }

  parameters: Parameters = new Parameters();

    configChanged(): void {
      this.configurationService.setParameters(this.parameters);
    }


}
