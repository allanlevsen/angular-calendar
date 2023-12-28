import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';

import { Officer } from 'src/app/models/officer.model';
import { Leave } from "src/app/models/leave.model";
import { OfficerForm } from "src/app/models/officer-form.model";
import { ApiService } from './api.service';
import { Person } from 'src/app/models/person.model';
import { OfficerViewModel } from 'src/app/models/officer-viewModel.model';
import { AutoMapperService } from './auto-mapper.service';
import { LeaveTypeViewModel } from 'src/app/models/leave-type-viewModel.model';
import { LeaveType } from 'src/app/models/leave-type.model';
import { OfficerLeave } from 'src/app/models/officer-leave.model';

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

  constructor(private apiService: ApiService, private autoMapperService: AutoMapperService) { }

  ///////////////////////////////////////////////////////////////////////////////////
  //
  // api service methods needed to connect to backend
  //


  // servie to get an officer
  // refer to previously written code for this within JOIN 2
  //
  getOfficer(agency: string, badgeNumber): Observable<OfficerViewModel> {
    return this.apiService.get<Officer>(`officer/${agency}/${badgeNumber}`).pipe(
      map(officer => this.autoMapperService.map(officer, OfficerViewModel) as OfficerViewModel)
    );
  }
  

  // services to get a list of Leave types
  //
  getLeaveTypes(): Observable<LeaveTypeViewModel[]> {
    return this.apiService.get<LeaveType[]>(`codetable/leavetypes`).pipe(
      map(leaveTypes => leaveTypes.map(leaveType => this.autoMapperService.map(leaveType, LeaveTypeViewModel) as LeaveTypeViewModel))
    );
  }

  addOrUpdateOfficerLeave(officerLeave: OfficerLeave): Observable<OfficerLeave>  {
    return this.apiService.post<OfficerLeave>('officerLeave', officerLeave).pipe(
      map(response => this.autoMapperService.map(response, OfficerLeave) as OfficerLeave)
    );
  }

  addOfficerSchedule(officerLeave: OfficerLeave): Observable<Officer> {
    return new Observable<Officer>((observer) => {
      try {

        this.addOrUpdateOfficerLeave(officerLeave).subscribe( officerLeave => {

          let newOfficer = new Officer(
            officerLeave.officerId, 
            officerLeave.agency, 
            officerLeave.badgeNumber, 
            officerLeave.firstName,
            officerLeave.lastName, 
            []);
          let newLeave = new Leave(
            officerLeave.leaveTypeId, 
            officerLeave.startDate, 
            officerLeave.endDate, 
            officerLeave.leaveTypeCode,
            officerLeave.leaveTypeName
          );         
          newOfficer.leaves.push(newLeave);

          observer.next(newOfficer); // Emit the new officer
          observer.complete();       // Close the observable stream
        });
      } catch (error) {
        observer.error(error);     // Emit an error if something goes wrong
      }
    });
  }

  //
  // 
  //
  ///////////////////////////////////////////////////////////////////////////////////



  ///////////////////////////////////////////////////////////////////////////////////
  //
  // Mostly, the following is code for the prototype interface
  // Generating id numbers, creating officers and leaves etc
  //



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

  // the following code, however, is not required in JOIN 2
  // and should be deleted

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
