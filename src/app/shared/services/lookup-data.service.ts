import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LookupKey } from '../../models/look-keys.model';
import { LeaveType } from 'src/app/models/leave-type.model';
import { LeaveTypeViewModel } from 'src/app/models/leave-type-viewModel.model';
import { SchedulingService } from './scheduling.service';

@Injectable({
  providedIn: 'root'
})
export class LookupDataService {

  constructor(private http: HttpClient, private schedulingService: SchedulingService) {}

  fetchFromServer(key: LookupKey): Observable<any> {
    switch (key) {
      case LookupKey.PERSON_TYPE:
        return this.getPersonTypes();
        case LookupKey.LEAVE_TYPE:
          return this.getLeaveTypes();
        default:
        throw new Error(`No fetch method defined for key: ${key}`);
    }
  }

  private getPersonTypes(): Observable<any[]> {
    return this.http.get<any[]>('/api/person-types');
  }

  private getLeaveTypes(): Observable<LeaveTypeViewModel[]> {
    return this.schedulingService.getLeaveTypes();
  }

}
