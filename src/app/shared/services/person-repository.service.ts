import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service'; // Adjust the path as necessary
import { Person } from '../../models/person.model'; // Adjust the path as necessary
import { PersonViewModel } from '../../models/person-viewModel.model' // Adjust the path as necessary
import { AutoMapperService } from './auto-mapper.service';


@Injectable({
   providedIn: 'root'
})
export class PersonRepositoryService {

   constructor(private apiService: ApiService, private autoMapperService: AutoMapperService) { }

   getPerson(personId: number): Observable<PersonViewModel> {
      return this.apiService.get<Person>(`persons/${personId}`).pipe(
         map(person => this.autoMapperService.map(person, PersonViewModel) as PersonViewModel)
      );
   }

   getPersons(): Observable<PersonViewModel[]> {
      return this.apiService.get<Person[]>('persons').pipe(
         map(persons => persons.map(person => this.autoMapperService.map(person, PersonViewModel) as PersonViewModel))
      );
   }

   addPerson(newPersonViewModel: PersonViewModel): Observable<PersonViewModel> {
      const person = this.autoMapperService.map(newPersonViewModel, Person);
      return this.apiService.post<Person>('persons', person).pipe(
         map(responsePerson => this.autoMapperService.map(responsePerson, PersonViewModel) as PersonViewModel)
      );
   }

   updatePerson(personId: number, updatedPersonViewModel: PersonViewModel): Observable<PersonViewModel> {
      const person = this.autoMapperService.map(updatedPersonViewModel, Person);
      return this.apiService.put<Person>(`persons/${personId}`, person).pipe(
         map(responsePerson => this.autoMapperService.map(responsePerson, PersonViewModel) as PersonViewModel)
      );
   }

   deletePerson(personId: number): Observable<PersonViewModel> {
      return this.apiService.delete<Person>(`persons/${personId}`).pipe(
         map(person => this.autoMapperService.map(person, PersonViewModel) as PersonViewModel)
      );
   }

}
