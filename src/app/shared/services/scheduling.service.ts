import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Officer, Leave, OfficerForm } from 'src/app/models/officer.model';

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

  constructor() { }


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
          officerForm.leaveType[0].toUpperCase(), 
          officerForm.leaveType);
        
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
}
