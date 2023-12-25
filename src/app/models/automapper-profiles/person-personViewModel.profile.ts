import { PersonViewModel } from "../person-viewModel.model";
import { Person } from "../person.model";
import { IMapper } from "../IMapper.interface";


 export class PersonToViewModelMapper implements IMapper<Person, PersonViewModel> {
   map(input: Person): PersonViewModel {
      return new PersonViewModel(
        input.personId,
        `${input.firstName} ${input.lastName}`,
        input.birthDate.toISOString().split('T')[0], // Format the date as a string
        input.emailAddress
      );
    }
 }
 
 export class ViewModelToPersonMapper implements IMapper<PersonViewModel, Person> {
   map(input: PersonViewModel): Person {
      const [firstName, lastName] = input.fullName.split(' ');
      return new Person(
        input.id,
        firstName,
        lastName,
        new Date(input.dateOfBirth),
        input.email
      );
    }
 }


