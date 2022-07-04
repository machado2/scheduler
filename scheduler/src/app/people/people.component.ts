import { Component, OnInit, ViewChild  } from '@angular/core';
import { MatTable } from '@angular/material/table';
import {MatInput} from '@angular/material/input';
import { throwDialogContentAlreadyAttachedError } from '@angular/cdk/dialog';
export interface Person {
  name: string;
}

const DATA: Person[] = [
  { name: 'Alice' },
  { name: 'Bob' },
  { name: 'Carlos' },
];

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.less']
})
export class PeopleComponent {

//  constructor() { }

  //ngOnInit(): void {  }

  @ViewChild(MatTable) table!: MatTable<Person>;
  @ViewChild(MatInput) input!: MatInput;

  displayedColumns: string[] = ['name', 'removebutton'];

  dataSource = [...DATA];

  removePerson(person: Person): void {
    const index = this.dataSource.indexOf(person, 0);
    if (index > -1) {
      this.dataSource.splice(index, 1);
    }
    this.table.renderRows();
  }

  addPerson() {
    const name = this.input.value;
    if (name.length < 1) {
      return;
    }
    this.dataSource.push({ name: name});
    this.table.renderRows();
  }

}
