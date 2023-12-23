import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Officer, Leave, OfficerForm } from 'src/app/models/officer.model';
import { ApiService } from './api.service';
import { Person } from 'src/app/models/person.model';

type FullName = {
  firstName: string;
  lastName: string;
};

const names: FullName[] = [
  { firstName: 'Emma', lastName: 'Johnson' },
  { firstName: 'Liam', lastName: 'Smith' },
  { firstName: 'Olivia', lastName: 'Williams' },
  { firstName: 'Noah', lastName: 'Brown' },
  { firstName: 'Ava', lastName: 'Jones' },
  { firstName: 'William', lastName: 'Garcia' },
  { firstName: 'Isabella', lastName: 'Miller' },
  { firstName: 'James', lastName: 'Davis' },
  { firstName: 'Sophia', lastName: 'Rodriguez' },
  { firstName: 'Logan', lastName: 'Martinez' }
];

@Injectable({
  providedIn: 'root'
})
export class SchedulingService {

  constructor(private apiService: ApiService) { }


  addOfficerSchedule(officerForm: OfficerForm): Observable<Officer> {
    return new Observable<Officer>((observer) => {
      try {
        // Temporary: Create a fake Id
        let id = this.getSecondsSince6AM();
        
        let newOfficer = new Officer(id, 
          officerForm.agency, 
          officerForm.badgeNumber, 
          this.getRandomName().firstName, // Assuming getRandomName() returns "lastName, firstName"
          this.getRandomName().lastName, 
          []);
        let newLeave = new Leave(id + 1, 
          officerForm.startDate, 
          officerForm.endDate, 
          officerForm.leaveName[0].toUpperCase(), 
          officerForm.leaveName);
        
        newOfficer.leaves.push(newLeave);

        observer.next(newOfficer); // Emit the new officer
        observer.complete();       // Close the observable stream
      } catch (error) {
        observer.error(error);     // Emit an error if something goes wrong
      }
    });
  }





  public getSecondsSince6AM(): number {
    const now = new Date();
    const sixAM = new Date(now);
    sixAM.setHours(6, 0, 0, 0); // set time to 6 AM
  
    // Calculate the difference in milliseconds
    const diff = now.getTime() - sixAM.getTime();
  
    // Convert milliseconds to seconds
    return Math.floor(diff / 1000);
  }

  private getRandomName(): FullName {
    const randomIndex = Math.floor(Math.random() * names.length);
    const randomName = names[randomIndex];
    return randomName;
  }

  // examples using the generic api service
  //

  // Get a person by ID
  getPerson(personId: number): void {
    this.apiService.get<Person>(`persons/${personId}`).subscribe(
      person => {
        console.log('Person data:', person);
      },
      error => {
        if (error.errorMessage.includes('timed out')) {
          console.error('Request timed out:', error.errorMessage);
        } else {
          console.error('An error occurred:', error.errorMessage);
        }
      }
    );
  }

  // Add a new person
  addPerson(newPerson: Person): void {
    this.apiService.post<Person>('persons', newPerson).subscribe(
      person => {
        console.log('Person added:', person);
      },
      error => {
        console.error('An error occurred:', error.errorMessage);
      }
    );
  }

  // Update a person's details
  updatePerson(personId: number, updatedPersonData: Person): void {
    this.apiService.put<Person>(`persons/${personId}`, updatedPersonData).subscribe(
      person => {
        console.log('Person updated:', person);
      },
      error => {
        console.error('An error occurred:', error.errorMessage);
      }
    );
  }

  // Delete a person by ID
  deletePerson(personId: number): void {
    this.apiService.delete<any>(`persons/${personId}`).subscribe(
      response => {
        console.log('Person deleted:', response);
      },
      error => {
        console.error('An error occurred:', error.errorMessage);
      }
    );
  }


}
