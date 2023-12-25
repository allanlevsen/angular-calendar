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
         map(person => this.autoMapperService.map(person, PersonViewModel))
      );
   }

   getPersons(): Observable<PersonViewModel[]> {
      return this.apiService.get<Person[]>('persons').pipe(
         map(persons => persons.map(person => this.autoMapperService.map(person, PersonViewModel)))
      );
   }

   addPerson(newPersonViewModel: PersonViewModel): Observable<PersonViewModel> {
      const person = this.autoMapperService.map(newPersonViewModel, Person);
      return this.apiService.post<Person>('persons', person).pipe(
         map(responsePerson => this.autoMapperService.map(person, PersonViewModel))
      );
   }

   updatePerson(personId: number, updatedPersonViewModel: PersonViewModel): Observable<PersonViewModel> {
      const person = this.autoMapperService.map(updatedPersonViewModel, Person);
      return this.apiService.put<Person>(`persons/${personId}`, person).pipe(
         map(responsePerson => this.autoMapperService.map(person, PersonViewModel))
      );
   }

   deletePerson(personId: number): Observable<PersonViewModel> {
      // Assuming the delete API returns the deleted Person object
      return this.apiService.delete<Person>(`persons/${personId}`).pipe(
         map(person => this.autoMapperService.map(person, PersonViewModel))
      );
   }
}


// Examples calling this repository service
// 
// NOTE: these examples are compatable with Angular 10 and older versions of RxJS
//
// WHEN: upgrading to later versions of RxJs, the subscribe is changed and 

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

         // Angular 17 and the latest version of RxJS would look like this:
         //

         this.personRepo.getPerson(1).subscribe({
            next: (person: PersonViewModel) => {
               console.log('Person:', person);
            },
            error: error => {
               console.error('Error:', error);
            },
            complete: () => {
               console.log('Completed');
            }
         });

         Explanation:

            - The subscribe method now takes an object with next, error, 
              and complete properties. Each property is a function that handles the 
              corresponding part of the subscription.

            - next is called with each emitted value (in your case, a PersonViewModel).
            - error is called if the Observable encounters an error.
            - complete is called when the Observable completes (this is optional and 
              often omitted if you don't need to perform any action on completion).




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


