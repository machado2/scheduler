import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { MatInput } from '@angular/material/input';
import { Person } from '../person';
import { ConfigurationService } from '../configuration.service';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.less']
})
export class PeopleComponent implements AfterViewInit {

  constructor(private configurationService: ConfigurationService) { }

  ngAfterViewInit(): void {
    this.configurationService.getConfiguration()
      .subscribe(config => {
          this.table.dataSource = config.people;
          this.table.renderRows();
      });
  }

  @ViewChild(MatTable) table!: MatTable<Person>;
  @ViewChild(MatInput) input!: MatInput;

  displayedColumns: string[] = ['name', 'removebutton'];

  dataSource: Person[] = [];

  removePerson(person: Person): void {
    this.configurationService.removePerson(person);
  }

  addPerson() {
    const name = this.input.value;
    if (name.length < 1) {
      return;
    }
    this.configurationService.addPerson(name);
    this.input.value = "";
  }

}
