import { Component } from '@angular/core';
import { Leave, LeaveForm, Officer, OfficerForm, ScheduleOption } from '../models/officer.model';
import { SchedulingService } from '../shared/services/scheduling.service';


@Component({
  selector: 'officer-bulk-entry',
  templateUrl: './officer-bulk-entry.component.html',
  styleUrls: ['./officer-bulk-entry.component.css']
})
export class OfficerBulkEntryComponent {

  // various types, constants, array data
  //
  officers: Officer[] = [
    new Officer(1, "Agency1", "BN001", "John", "Doe", []),
    new Officer(2, "Agency2", "BN002", "Jane", "Smith", [
      new Leave(2, new Date("2023-01-01"), new Date("2023-01-10"), "F", "First Watch")
    ]),
    new Officer(3, "Agency3", "BN003", "Alice", "Johnson", [
      new Leave(3, new Date("2023-02-01"), new Date("2023-02-05"), "S", "Second Watch"),
      new Leave(3, new Date("2023-03-01"), new Date("2023-03-10"), "H", "Holiday")
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

  // add officer form related variables
  //
  officerForm: OfficerForm = new OfficerForm();
  submitted = false;

  // Inline Leave variables
  //
  showCalendar: boolean = false;
  showCalendarId: number; 
  calendarLeaveIndex: number;

  activeOfficerIndex: number | null = null;
  editingLeave: LeaveForm | null = null;
  editingOfficerId: number | null = null;
  editingLeaveIndex: number | null = null;
  
  constructor(private schedulingService: SchedulingService) {
  }


  ////////////////////////////////////////////////////////////
  //
  // UI Events
  //

  onSubmit() { 
    this.submitted = true; 
    let officer = this.createNewOfficer(this.officerForm);
    console.log(officer);
  }

  // This would be bound to the click event of the trash can icon in your template
  onDeleteClick(officerId: number): void {
    this.deleteOfficerById(officerId);
  }

  onShowAddLeaveForm(index: number): void {
    this.activeOfficerIndex = index;
    this.editingLeave = new LeaveForm();
  }

  onAddLeave( officerId: number, event: Event): void {
    event.preventDefault(); 

    const newLeave = new Leave(
      this.schedulingService.getSecondsSince6AM(),
      this.getScheduleDate(this.editingLeave.startDate),
      this.getScheduleDate(this.editingLeave.endDate),
      this.editingLeave.leaveName[0].toUpperCase(),
      this.editingLeave.leaveName
    );
    const officer = this.officers.find(o => o.id === officerId);
    if (officer) {
      officer.leaves.push(newLeave);
    }
    this.activeOfficerIndex = null; // Hide the form after adding the leave
  }

  onCancelAddLeave(): void {
    this.activeOfficerIndex = null; // Hide the form
  }
  
  onCancelEdit() {
    this.cancelEdit();
  }

  onEditLeave(officerId: number, leaveIndex: number, leave: Leave): void {
    this.editingOfficerId = officerId;
    this.editingLeaveIndex = leaveIndex;
    this.editingLeave = this.getLeaveEditingForm();
    this.editingLeave.leaveName = leave.leaveName;
    this.editingLeave.startDate = this.getScheduleDateString(leave.startDate);
    this.editingLeave.endDate = this.getScheduleDateString(leave.endDate);
  }

  onShowCalendar(officerId: number, leaveIndex: number) {
    let thisCalendarId = this.getUniqueCalendarId(officerId, leaveIndex);

    if (thisCalendarId === this.showCalendarId)
      this.showCalendar = !this.showCalendar;
    else
      this.showCalendar = true;

    this.calendarLeaveIndex = null;
    this.showCalendarId = null;
    if (this.showCalendar) {
      this.calendarLeaveIndex = leaveIndex;
      this.showCalendarId = thisCalendarId;
    }
  }

  onUpdateLeave(officerId: number, leaveIndex: number, event: Event): void {
    event.preventDefault();
    const officer = this.officers.find(o => o.id === officerId);
    if (officer && officer.leaves[leaveIndex]) {
      officer.leaves[leaveIndex].leaveName = this.editingLeave.leaveName
      officer.leaves[leaveIndex].startDate = this.getScheduleDate(this.editingLeave.startDate);
      officer.leaves[leaveIndex].endDate = this.getScheduleDate(this.editingLeave.endDate);
    }
    this.cancelEdit(); // Reset editing state
  }

  onRemoveLeave(officerId: number, leaveIndex: number): void {
    // Find the officer
    const officer = this.officers.find(o => o.id === officerId);
  
    // If the officer is found and the leave index is valid
    if (officer && leaveIndex > -1 && officer.leaves && officer.leaves.length > leaveIndex) {
      // Remove the leave from the officer's leaves array
      officer.leaves.splice(leaveIndex, 1);
    }
  
    // You might want to handle any updates or refreshes here
  } 

  isEditing(officerId: number, leaveIndex: number): boolean {
    return this.editingOfficerId === officerId && this.editingLeaveIndex === leaveIndex;
  }

  isShowCalendar(officerId: number, leaveIndex: number): boolean {
    let thisCalendarId = this.getUniqueCalendarId(officerId, leaveIndex);
    return this.showCalendarId === thisCalendarId;
  }

  
  ////////////////////////////////////////////////////////////
  //
  // Utility functions
  //

  getLeaveEditingForm(): LeaveForm {
    if (this.editingLeave === null) {
      this.editingLeave = new LeaveForm();
    }

    return this.editingLeave;
  }

  clearLeaveEditingForm() {
    if (this.editingLeave != null) {
      this.editingLeave = null;
    }
  }

  getString(dateString: string): string {
    return dateString;
  }

  getUniqueCalendarId(officerId: number, leaveIndex: number) : number {
    return officerId*10+leaveIndex;
  }

  getScheduleDateString(input) {
    let date;

    if (typeof input === 'string') {
        // Parse the date as local time but set the time to midnight
        const parts = input.split('-'); // Split YYYY-MM-DD
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
        const day = parseInt(parts[2], 10);

        date = new Date(year, month, day);
    } else if (input instanceof Date) {
        // If the input is a Date object, create a new Date with the same local date
        date = new Date(input.getFullYear(), input.getMonth(), input.getDate());
    } else {
        throw new Error('Input must be a date string or a Date object');
    }

    // Format the date to yyyy-mm-dd
    let year = date.getUTCFullYear();
    let month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    let day = date.getUTCDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  getScheduleDateShortString(input) {
    // Array of month names
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // local variable to hold the working date
    let date;

    if (typeof input === 'string') {
        // Parse the date as local time but set the time to midnight
        const parts = input.split('-'); // Split YYYY-MM-DD
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
        const day = parseInt(parts[2], 10);

        date = new Date(year, month, day);
    } else if (input instanceof Date) {
        // If the input is a Date object, create a new Date with the same local date
        date = new Date(input.getFullYear(), input.getMonth(), input.getDate());
    } else {
        throw new Error('Input must be a date string or a Date object');
    }

    // Format the date to 'MMM dd, yyyy'
    let year = date.getUTCFullYear();
    let month = monthNames[date.getUTCMonth()];
    let day = date.getUTCDate().toString().padStart(2, '0');

    return `${month} ${day}, ${year}`;
  }

  getScheduleDate(input) {
    let date;

    if (typeof input === 'string') {
        // Parse the date as local time but set the time to midnight
        const parts = input.split('-'); // Split YYYY-MM-DD
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
        const day = parseInt(parts[2], 10);

        date = new Date(year, month, day);
    } else if (input instanceof Date) {
        // If the input is a Date object, create a new Date with the same local date
        date = new Date(input.getFullYear(), input.getMonth(), input.getDate());
    } else {
        throw new Error('Input must be a date string or a Date object');
    }

    return date;
  }
  
  ////////////////////////////////////////////////////////////
  //
  // UI related functions
  //

  addOfficerToList(officer: Officer)
  {
    this.officers.push(officer);
  }

  deleteOfficerById(officerId: number): void {
    // Find the index of the officer with the given ID
    const index = this.officers.findIndex(officer => officer.id === officerId);

    // If the officer is found
    if (index > -1) {
      // Remove the officer from the array
      this.officers.splice(index, 1);
    }
  }

  cancelEdit(): void {
    this.editingOfficerId = null;
    this.editingLeaveIndex = null;
    this.clearLeaveEditingForm();
  }


  ////////////////////////////////////////////////////////////
  //
  // Database related functions
  //

  createNewOfficer(officerForm: OfficerForm) : Officer {
    officerForm.startDate = this.getScheduleDate(officerForm.startDate);
    officerForm.endDate = this.getScheduleDate(officerForm.endDate);

    this.schedulingService
        .addOfficerSchedule(officerForm)
        .subscribe( o => {
          this.addOfficerToList(o);
          return o;
        });

    return null;
  }


}
