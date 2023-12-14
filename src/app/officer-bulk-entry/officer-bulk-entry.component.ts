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
      new Date(this.editingLeave.startDate),
      new Date(this.editingLeave.endDate),
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
    this.editingLeave.startDate = this.formatDate(leave.startDate);
    this.editingLeave.endDate = this.formatDate(leave.endDate);
  }

  onShowCalendar(officerId: number, leaveIndex: number) {
    this.calendarLeaveIndex = null;
      this.showCalendarId = null;
    this.showCalendar = !this.showCalendar;
    if (this.showCalendar) {
      this.calendarLeaveIndex = leaveIndex;
      this.showCalendarId = officerId;
    }
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
    return this.showCalendarId === officerId && this.calendarLeaveIndex === leaveIndex;
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

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  getString(dateString: string): string {
    return dateString;
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

  onUpdateLeave(officerId: number, leaveIndex: number, event: Event): void {
    event.preventDefault();
    const officer = this.officers.find(o => o.id === officerId);
    if (officer && officer.leaves[leaveIndex]) {
      officer.leaves[leaveIndex].leaveName = this.editingLeave.leaveName
      officer.leaves[leaveIndex].startDate = new Date(this.editingLeave.startDate);
      officer.leaves[leaveIndex].endDate = new Date(this.editingLeave.endDate);
    }
    this.cancelEdit(); // Reset editing state
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
    this.schedulingService
        .addOfficerSchedule(officerForm)
        .subscribe( o => {
          this.addOfficerToList(o);
          return o;
        });

    return null;
  }


}
