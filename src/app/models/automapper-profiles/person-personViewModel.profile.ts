import { PersonViewModel } from "../person-viewModel.model";
import { Person } from "../person.model";
import { IMapper } from "../IMapper.interface";

export class PersonToViewModelMapper implements IMapper<Person, PersonViewModel> {
   map(input: Person): PersonViewModel {
      return new PersonViewModel({
         id: input.personId,
         fullName: `${input.firstName} ${input.lastName}`,
         dateOfBirth: input.birthDate.toISOString().split('T')[0], // Format the date as a string
         email: input.emailAddress
      });
   }
}

export class ViewModelToPersonMapper implements IMapper<PersonViewModel, Person> {
   map(input: PersonViewModel): Person {
      const [firstName, lastName] = input.fullName.split(' ');
      return new Person({
         personId: input.id,
         firstName: firstName,
         lastName: lastName,
         birthDate: new Date(input.dateOfBirth),
         emailAddress: input.email
      });
   }
}


