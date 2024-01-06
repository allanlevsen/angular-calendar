import { Component, OnInit } from '@angular/core';
import { AutoMapperService } from './shared/services/auto-mapper.service';
import { Person } from './models/person.model';
import { PersonViewModel } from './models/person-viewModel.model';
import { PersonToViewModelMapper, ViewModelToPersonMapper } from './models/automapper-profiles/person-personViewModel.profile';
import { PersonRepositoryService } from './shared/services/person-repository.service';
import { LeaveType } from './models/leave-type.model';
import { LeaveTypeViewModel } from './models/leave-type-viewModel.model';
import { LeaveTypeToViewModelMapper, ViewModelToLeaveTypeMapper } from './models/automapper-profiles/leaveType-leaveTypeViewModel.profile';
import { OfficerLeave } from './models/officer-leave.model';
import { OfficerLeaveToViewModelMapper, ViewModelToOfficerLeaveMapper } from './models/automapper-profiles/officerLeave-officerLeaveViewModel.profile';
import { Officer } from './models/officer.model';
import { OfficerViewModel } from './models/officer-viewModel.model';
import { OfficerToViewModelMapper, ViewModelToOfficerMapper } from './models/automapper-profiles/officer-officerViewModel.profile';
import { Leave } from './models/leave.model';
import { LeaveViewModel } from './models/leave-viewModel.model';
import { LeaveToViewModelMapper, ViewModelToLeaveMapper } from './models/automapper-profiles/leave-leaveViewModel.profile';
import { LeaveForm } from './models/leave-form.model';
import { LeaveStylingService } from './shared/services/leave-styling.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angular-calendar';

  constructor(private autoMapper: AutoMapperService, private leaveStylingService: LeaveStylingService) {

    this.registerAutomapperTypes();
  }

  ngOnInit(): void {


      let officer: Officer = new Officer({
        id: 1,
        agency: "EPS",
        badgeNumber: "123",
        firstName: "Allan",
        lastName: "Levsen",
        leaves: []
    });
    // OR we can do this
    //
    // let officer = {
    //   id: 1,
    //   agency: "EPS",
    //   badgeNumber: "123",
    //   firstName: "Allan",
    //   lastName: "Levsen",
    //   leaves: []
    // } as Officer;

     var profile = this.autoMapper.map(officer, OfficerViewModel) as OfficerViewModel;
     console.log(profile);

     
    let officerLeave: OfficerLeave = new OfficerLeave({
      officerLeaveId: 0,
      officerId: 1,
      firstName: "Allan",
      lastName: "Levsen",
      badgeNumber: "12345689",
      agencyId: 1,
      agency: "EPS",
      startDate: new Date(),
      endDate: new Date(),
      leaveTypeId: 1,
      leaveTypeCode: 'F',
      leaveTypeName: 'First Watch'
    });

    var leave = this.autoMapper.map(officerLeave, OfficerLeave) as OfficerLeave
    console.log(leave);
  }

  registerAutomapperTypes() {
    // Registration for Person to PersonViewModel
    this.autoMapper.registerMapper(Person, PersonViewModel, new PersonToViewModelMapper());
    this.autoMapper.registerMapper(PersonViewModel, Person, new ViewModelToPersonMapper());

    // Registration for LeaveType to LeaveTypeViewModel
    this.autoMapper.registerMapper(LeaveType, LeaveTypeViewModel, new LeaveTypeToViewModelMapper(this.leaveStylingService));
    this.autoMapper.registerMapper(LeaveTypeViewModel, LeaveType, new ViewModelToLeaveTypeMapper(this.leaveStylingService));

    // Registration for Leave to LeaveViewModel
    this.autoMapper.registerMapper(Leave, LeaveViewModel, new LeaveToViewModelMapper());
    this.autoMapper.registerMapper(LeaveViewModel, Leave, new ViewModelToLeaveMapper());
  
    // Registration for OfficerLeave to OfficerLeave (there is no LeaveTypeViewModel)
    this.autoMapper.registerMapper(OfficerLeave, OfficerLeave, new OfficerLeaveToViewModelMapper());
    //this.autoMapper.registerMapper(OfficerLeave, OfficerLeave, new ViewModelToOfficerLeaveMapper());

    // Registration for OfficerLeave to OfficerLeave (there is no LeaveTypeViewModel)
    this.autoMapper.registerMapper(Officer, OfficerViewModel, new OfficerToViewModelMapper());
    this.autoMapper.registerMapper(OfficerViewModel, Officer, new ViewModelToOfficerMapper());
  }

}
