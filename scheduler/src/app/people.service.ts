import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Person } from './person';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {

  people: BehaviorSubject<Person[]> = new BehaviorSubject<Person[]>(
    [
      { name: 'Alice' },
      { name: 'Bob' },
      { name: 'Carlos' },
    ]
  );

  getPeople(): Observable<Person[]> {
    return this.people;
  }

  addPerson(name: string) {
    name = name.trim();
    if (name && name.length > 0) {
      const value = this.people.getValue();
      if (value.filter((p) => p.name.toLowerCase() == name.toLowerCase()).length > 0) {
        return;
      }
      value.push({ name: name });
      this.people.next(value);
    }
  }

  removePerson(person: Person): void {
    const value = this.people.getValue();
    const index = value.indexOf(person, 0);
    if (index > -1) {
      value.splice(index, 1);
      this.people.next(value);
    }
  }

}
