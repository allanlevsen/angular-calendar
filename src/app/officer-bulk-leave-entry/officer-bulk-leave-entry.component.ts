import { Component, OnInit } from '@angular/core';
import { Officer } from '../models/officer.model';
import { LeaveForm } from "../models/leave-form.model";
import { Leave } from "../models/leave.model";
import { OfficerLeave } from "../models/officer-leave.model";
import { SchedulingService } from '../shared/services/scheduling.service';
import { LeaveTypeViewModel } from '../models/leave-type-viewModel.model';
import { LeaveType } from '../models/leave-type.model';


@Component({
  selector: 'officer-bulk-entry',
  templateUrl: './officer-bulk-leave-entry.component.html',
  styleUrls: ['./officer-bulk-leave-entry.component.css']
})
export class OfficerBulkLeaveEntryComponent implements OnInit {

  // various types, constants, array data
  //
  officers: Officer[] = [
    // new Officer({id: 1, agency: "Agency1", badgeNumber: "BN001", firstName: "John", lastName: "Doe", leaves: []}),
    // new Officer({2, "Agency2", "BN002", "Jane", "Smith", [
    //   new Leave(2, new Date("2023-01-01"), new Date("2023-01-10"), "F", "First Watch")
    // ]}),
    // new Officer({3, "Agency3", "BN003", "Alice", "Johnson", [
    //   new Leave(3, new Date("2023-02-01"), new Date("2023-02-05"), "S", "Second Watch"),
    //   new Leave(3, new Date("2023-03-01"), new Date("2023-03-10"), "H", "Holiday")
    // ]})
  ];

  leaveTypes: LeaveTypeViewModel[];

  // add officer form related variables
  //
  officerLeave: OfficerLeave = new OfficerLeave();
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

  ngOnInit(): void {
    this.schedulingService.getLeaveTypes().subscribe( leaveTypes => {
      this.leaveTypes = leaveTypes;

      // add a select Leave Type into the first item of the array
      // New LeaveType object to add
      let selectLeaveType = new LeaveType({id: 0, name: 'Select Type', code: '', description: 'Empty Leave Type', backgroundColor: null});

      // Add the new LeaveType to the beginning of the array
      leaveTypes.unshift(selectLeaveType);
      this.officerLeave.leaveTypeName = 'Select Type';

    });
  }

  ////////////////////////////////////////////////////////////
  //
  // UI Events
  //

  onSubmit() { 
    this.submitted = true; 

    const badgeNumbersArray = this.officerLeave.badgeNumber.split(',').map(num => num.trim());
    badgeNumbersArray.forEach(badgeNumber => {

      // We are iterating through each of the badge numbers entered
      // if the badgeNumber is valid
      //
      if (badgeNumber) {

        // search database given the agency and badge number...
        // TODO: we need to catch an error if the officer is not found
        //       or if there is an error on the API
        //
        this.schedulingService.getOfficer(this.officerLeave.agency, badgeNumber)
                              .subscribe(officer => {

          const officerLeave: OfficerLeave = new OfficerLeave({
            officerLeaveId: 0,
            officerId: officer.id,
            firstName: officer.firstName,
            lastName: officer.lastName,
            badgeNumber: badgeNumber,
            agencyId: 0, // we should get this from the localStorage list
            agency: this.officerLeave.agency,
            startDate: this.getScheduleDate(this.officerLeave.startDate),
            endDate: this.getScheduleDate(this.officerLeave.endDate),
            leaveTypeCode: this.officerLeave.leaveTypeName[0], // we should get this from the localStorage list
            leaveTypeName: this.officerLeave.leaveTypeName
          });
          this.schedulingService.addOfficerSchedule(officerLeave).subscribe( officerLeave => {
            this.addOfficerToList(officerLeave);
          });
        });

      }
    });
  }


  onDeleteClick(officerId: number): void {
    this.deleteOfficerById(officerId);
  }

  onShowAddLeaveForm(index: number): void {
    this.activeOfficerIndex = index;
    this.editingLeave = new LeaveForm();
  }

  onAddLeave( officerId: number, event: Event): void {
    event.preventDefault(); 

    const newLeave = new Leave({
      leaveId: this.schedulingService.getGeneratedId(),
      officerId: officerId,
      startDate: this.getScheduleDate(this.editingLeave.startDate),
      endDate: this.getScheduleDate(this.editingLeave.endDate),
      leaveCode: this.editingLeave.leaveName[0].toUpperCase(),
      leaveName: this.editingLeave.leaveName
    });
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
    this.editingLeave.leaveCode = leave.leaveCode;
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
      officer.leaves[leaveIndex].leaveCode = this.editingLeave.leaveName[0].toUpperCase()
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


}
