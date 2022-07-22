import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, debounceTime } from 'rxjs';
import { Configuration } from './configuration';
import { Person } from './person';
import { Parameters } from './parameters';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  modifyConfiguration(f: (c: Configuration) => void) {
    const data = this.configuration.getValue();
    f(data);
    this.configuration.next(data);
  }

  constructor() { 
    this.modifyConfiguration(config => {
      config.addPerson('Alice');
      config.addPerson('Bob');
      config.addPerson('Carlos');
    });
  }

  configuration: BehaviorSubject<Configuration> = new BehaviorSubject<Configuration>(new Configuration());

  getConfiguration(): Observable<Configuration> {
    return this.configuration.pipe(debounceTime(500));
  }

  addPerson(name: string) {
    this.modifyConfiguration(config => {
      config.addPerson(name);
    });
  }

  removePerson(person: Person): void {
    this.modifyConfiguration(config => {
      config.removePerson(person);
    });
  }

  setParameters(parameters: Parameters): void {
    this.modifyConfiguration(config => {
      config.parameters = parameters;
    });
  }

}
