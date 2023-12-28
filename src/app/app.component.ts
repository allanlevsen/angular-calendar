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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angular-calendar';

  constructor(private autoMapper: AutoMapperService, private personRepo: PersonRepositoryService) {

    this.registerAutomapperTypes();
  }

  ngOnInit(): void {
    
    // getPerson Example

    this.personRepo.getPerson(1).subscribe(
        (person: PersonViewModel) => {
          console.log('Person:', person);
        },
        error => {
          console.error('Error:', error);
        }
    );
      
  }

  registerAutomapperTypes() {
    // Registration for Person to PersonViewModel
    this.autoMapper.registerMapper(Person, PersonViewModel, new PersonToViewModelMapper());
    this.autoMapper.registerMapper(PersonViewModel, Person, new ViewModelToPersonMapper());

    // Registration for LeaveType to LeaveTypeViewModel
    this.autoMapper.registerMapper(LeaveType, LeaveTypeViewModel, new LeaveTypeToViewModelMapper());
    this.autoMapper.registerMapper(LeaveTypeViewModel, LeaveType, new ViewModelToLeaveTypeMapper());

    // Registration for OfficerLeave to OfficerLeave (there is no LeaveTypeViewModel)
    this.autoMapper.registerMapper(OfficerLeave, OfficerLeave, new OfficerLeaveToViewModelMapper());
    this.autoMapper.registerMapper(OfficerLeave, OfficerLeave, new ViewModelToOfficerLeaveMapper());

    // Registration for OfficerLeave to OfficerLeave (there is no LeaveTypeViewModel)
    this.autoMapper.registerMapper(Officer, OfficerViewModel, new OfficerToViewModelMapper());
    this.autoMapper.registerMapper(OfficerViewModel, Officer, new ViewModelToOfficerMapper());       
  }
  
}
