import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';

import { Officer } from 'src/app/models/officer.model';
import { Leave } from "src/app/models/leave.model";
import { ApiService } from './api.service';
import { Person } from 'src/app/models/person.model';
import { OfficerViewModel } from 'src/app/models/officer-viewModel.model';
import { AutoMapperService } from './auto-mapper.service';
import { LeaveTypeViewModel } from 'src/app/models/leave-type-viewModel.model';
import { LeaveType } from 'src/app/models/leave-type.model';
import { OfficerLeave } from 'src/app/models/officer-leave.model';


@Injectable({
  providedIn: 'root'
})
export class SchedulingService {

  constructor(private apiService: ApiService, private autoMapperService: AutoMapperService) { }

  ///////////////////////////////////////////////////////////////////////////////////
  //
  // api service methods needed to connect to backend
  //


  // service to get an officer
  // refer to previously written code for this within JOIN2 and JACS
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

  addOrUpdateOfficerLeave(officerLeave: OfficerLeave): Observable<OfficerLeave> {
    return this.apiService.post<OfficerLeave>('officerLeave', officerLeave).pipe(
      map(response => this.autoMapperService.map(response as OfficerLeave, OfficerLeave) as OfficerLeave)
    );
  }

  addOfficerSchedule(officerLeave: OfficerLeave): Observable<Officer> {
    return new Observable<Officer>((observer) => {
      try {

        this.addOrUpdateOfficerLeave(officerLeave).subscribe(officerLeave => {

          let newOfficer = new Officer({
            id: officerLeave.officerId,
            agency: officerLeave.agency,
            badgeNumber: officerLeave.badgeNumber,
            firstName: officerLeave.firstName,
            lastName: officerLeave.lastName,
            leaves: []
          });
          let newLeave = new Leave({
            leaveId: officerLeave.leaveTypeId,
            officerId: officerLeave.officerId,
            startDate: officerLeave.startDate,
            endDate: officerLeave.endDate,
            leaveCode: officerLeave.leaveTypeCode,
            leaveName: officerLeave.leaveTypeName
          });
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
  // This will not be needed in the JOIN2 application code
  //

  public getGeneratedId(): number {

    // Generate the number of seconds since 6am
    //
    const now = new Date();
    const sixAM = new Date(now);
    sixAM.setHours(6, 0, 0, 0); // set time to 6 AM

    // Calculate the difference in milliseconds
    const diff = now.getTime() - sixAM.getTime();

    // Convert milliseconds to seconds
    return Math.floor(diff / 1000);
  }

}
