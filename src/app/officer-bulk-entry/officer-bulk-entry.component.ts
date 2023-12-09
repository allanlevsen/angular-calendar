import { Component } from '@angular/core';
import { Leave, Officer, OfficerForm } from '../models/officer.model';

interface ScheduleOption {
  DisplayName: string;
  DataValue: string;
  CategoryTypeColor: string;
}

@Component({
  selector: 'officer-bulk-entry',
  templateUrl: './officer-bulk-entry.component.html',
  styleUrls: ['./officer-bulk-entry.component.css']
})
export class OfficerBulkEntryComponent {

  officers: Officer[] = [
    new Officer(1, "Agency1", "BN001", "John", "Doe", []),
    new Officer(2, "Agency2", "BN002", "Jane", "Smith", [
      new Leave(2, new Date("2023-01-01"), new Date("2023-01-10"), "LC001", "Annual Leave")
    ]),
    new Officer(3, "Agency3", "BN003", "Alice", "Johnson", [
      new Leave(3, new Date("2023-02-01"), new Date("2023-02-05"), "LC002", "Sick Leave"),
      new Leave(3, new Date("2023-03-01"), new Date("2023-03-10"), "LC003", "Casual Leave")
    ])
  ];

  scheduleOptions: ScheduleOption[] = [
    { DisplayName: 'First Watch', DataValue: 'F', CategoryTypeColor: '#acc5ff' },
    { DisplayName: 'Second Watch', DataValue: 'S', CategoryTypeColor: '#acc5ff' },
    { DisplayName: 'Third Watch', DataValue: 'T', CategoryTypeColor: '#acc5ff' },
    { DisplayName: 'Day Off', DataValue: 'D', CategoryTypeColor: '#f97a7a' },
    { DisplayName: 'Holiday', DataValue: 'H', CategoryTypeColor: '#f9d77a' },
    { DisplayName: 'Course', DataValue: 'C', CategoryTypeColor: '#7ae8f9' },
    { DisplayName: 'Maternity Leave', DataValue: 'M', CategoryTypeColor: '#7af9d5' },
    { DisplayName: 'Extended Leave', DataValue: 'L', CategoryTypeColor: '#b57af9' },
    { DisplayName: 'Unavailable', DataValue: 'U', CategoryTypeColor: '#919191' }
  ];  
  

  officerForm: OfficerForm = new OfficerForm();
  submitted = false;

  onSubmit() { 
    this.submitted = true; 
    let officer = this.createNewOfficer(this.officerForm);
    console.log(officer);
  }

  createNewOfficer(officerForm: OfficerForm) : Officer {
    let newOfficer = new Officer(0, officerForm.agency, officerForm.badgeNumber, '', '', []);
    let newLeave = new Leave(0, officerForm.startDate, officerForm.endDate, '', officerForm.leaveType);
    newOfficer.leaves.push(newLeave);
    this.officers.push(newOfficer);

    return newOfficer;
  }


}
