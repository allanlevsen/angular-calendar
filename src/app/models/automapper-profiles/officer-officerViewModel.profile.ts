import { OfficerViewModel } from "../officer-viewModel.model";
import { Officer } from '../officer.model';
import { IMapper } from "../IMapper.interface";

 export class OfficerToViewModelMapper implements IMapper<Officer, OfficerViewModel> {
   map(input: Officer): OfficerViewModel {
      let o =  new OfficerViewModel(
        input.id,
        input.agency,
        input.badgeNumber,
        input.firstName,
        input.lastName
      );
      o.leaves = [];
      return o;
    }
 }
 
 export class ViewModelToOfficerMapper implements IMapper<OfficerViewModel, Officer> {
   map(input: OfficerViewModel): Officer {
      return new Officer(
         input.id,
         input.agency,
         input.badgeNumber,
         input.firstName,
         input.lastName,
         input.leaves
      );
    }
 }
