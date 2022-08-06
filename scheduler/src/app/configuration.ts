import { Person } from './person';
import { Parameters } from './parameters';

export class Configuration {

    people: Person[] = [];
    parameters: Parameters = new Parameters();
    
    addPerson(name: string) {
        name = name.trim();
        if (name && name.length > 0) {
          if (this.people.filter((p) => p.name.toLowerCase() == name.toLowerCase()).length > 0) {
            return;
          }
          this.people.push({ name: name, id: crypto.randomUUID() });
        }
      }
    
      removePerson(person: Person): void {
        const index = this.people.indexOf(person, 0);
        if (index > -1) {
          this.people.splice(index, 1);
        }
      }
      
}