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


   // Mapping from Person to PersonViewModel
   //
   //const personViewModel = this.autoMapper.map(person, PersonViewModel);

   // Mapping from PersonViewModel to Person
   //
   // const person = this.autoMapper.map(personViewModel, Person);

  constructor(private apiService: ApiService, private autoMapperService: AutoMapperService) { }

  private mapToPersonViewModel(person: Person): PersonViewModel {
    return this.autoMapperService.map(person, PersonViewModel);
  }

  private mapToPerson(personViewModel: PersonViewModel): Person {
   return this.autoMapperService.map(personViewModel, Person);
  }

  getPerson(personId: number): Observable<PersonViewModel> {
    return this.apiService.get<Person>(`persons/${personId}`).pipe(
      map(person => this.mapToPersonViewModel(person))
    );
  }

  addPerson(newPersonViewModel: PersonViewModel): Observable<PersonViewModel> {
    const person = this.mapToPerson(newPersonViewModel);
    return this.apiService.post<Person>('persons', person).pipe(
      map(responsePerson => this.mapToPersonViewModel(responsePerson))
    );
  }

  updatePerson(personId: number, updatedPersonViewModel: PersonViewModel): Observable<PersonViewModel> {
    const person = this.mapToPerson(updatedPersonViewModel);
    return this.apiService.put<Person>(`persons/${personId}`, person).pipe(
      map(responsePerson => this.mapToPersonViewModel(responsePerson))
    );
  }

  deletePerson(personId: number): Observable<PersonViewModel> {
    // Assuming the delete API returns the deleted Person object
    return this.apiService.delete<Person>(`persons/${personId}`).pipe(
      map(person => this.mapToPersonViewModel(person))
    );
  }
}


// Examples calling this repository service

/*

         // Example of getting a person
         //

         getPersonExample() {
         this.personRepo.getPerson(1).subscribe(
            person => {
               console.log('Person:', person);
            },
            error => {
               console.error('Error:', error);
            }
         );
         }


         // Example of adding a person
         //
         
         addPersonExample() {
         const newPerson = new Person(0, 'John', 'Doe', new Date('1990-01-01'), 'john.doe@example.com');
         
         this.personRepo.addPerson(newPerson).subscribe(
            person => {
               console.log('Person added:', person);
            },
            error => {
               console.error('Error occurred while adding person:', error);
            }
         );
         }


         // Example of updating a person
         //
         
         updatePersonExample() {
         const updatedPersonData = new Person(1, 'Jane', 'Doe', new Date('1990-01-01'), 'jane.doe@example.com');

         this.personRepo.updatePerson(1, updatedPersonData).subscribe(
            person => {
               console.log('Person updated:', person);
            },
            error => {
               console.error('Error occurred while updating person:', error);
            }
         );
         }


         // Example of deleting a person
         //
         
         deletePersonExample() {
         const personIdToDelete = 1;

         this.personRepo.deletePerson(personIdToDelete).subscribe(
            response => {
               console.log('Person deleted successfully:', response);
            },
            error => {
               console.error('Error occurred while deleting person:', error);
            }
         );
         }


*/


