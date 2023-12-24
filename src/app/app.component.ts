import { Component, OnInit } from '@angular/core';
import { AutoMapperService } from './shared/services/auto-mapper.service';
import { Person } from './models/person.model';
import { PersonViewModel } from './models/person-viewModel.model';
import { PersonToViewModelMapper, ViewModelToPersonMapper } from './models/automapper-profiles/person-personViewModel.profile';
import { PersonRepositoryService } from './shared/services/person-repository.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angular-calendar';

  constructor(private autoMapper: AutoMapperService, private personRepo: PersonRepositoryService) {

    // Registration for Person to PersonViewModel
    this.autoMapper.registerMapper(Person, PersonViewModel, new PersonToViewModelMapper());

    // Registration for PersonViewModel to Person
    this.autoMapper.registerMapper(PersonViewModel, Person, new ViewModelToPersonMapper());
  }

  ngOnInit(): void {
    
    // getPerson Example

    this.personRepo.getPerson(1).subscribe(
        person => {
          console.log('Person:', person);
        },
        error => {
          console.error('Error:', error);
        }
    );
      
  }
  
}
