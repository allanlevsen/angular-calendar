import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service'; // Adjust the path as necessary
import { Person } from '../../models/person.model'; // Adjust the path as necessary

@Injectable({
  providedIn: 'root'
})
export class PersonRepositoryService {

  constructor(private apiService: ApiService) { }

  getPerson(personId: number): Observable<Person> {
    return this.apiService.get<Person>(`persons/${personId}`);
  }

  addPerson(newPerson: Person): Observable<Person> {
    return this.apiService.post<Person>('persons', newPerson);
  }

  updatePerson(personId: number, updatedPersonData: Person): Observable<Person> {
    return this.apiService.put<Person>(`persons/${personId}`, updatedPersonData);
  }

  deletePerson(personId: number): Observable<any> {
    return this.apiService.delete<any>(`persons/${personId}`);
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


