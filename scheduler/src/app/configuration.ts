import { Person } from './person';
import { DateTime } from 'luxon';

export class Configuration {

    people: Person[] = [];
    startingDate: DateTime = DateTime.now();
    numberOfDays: number = 7;
    
    addPerson(name: string) {
        name = name.trim();
        if (name && name.length > 0) {
          if (this.people.filter((p) => p.name.toLowerCase() == name.toLowerCase()).length > 0) {
            return;
          }
          this.people.push({ name: name });
        }
      }
    
      removePerson(person: Person): void {
        const index = this.people.indexOf(person, 0);
        if (index > -1) {
          this.people.splice(index, 1);
        }
      }
      
}