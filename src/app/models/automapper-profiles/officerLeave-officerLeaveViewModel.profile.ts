import { IMapper } from "../IMapper.interface";
import { OfficerLeave } from "../officer-leave.model";


// The officerLeave doesn't require a view model and therefore
// the following profile classes simply return the object passed in
// Or, we simply don't use the automapper feature for this type. However,
// if, in the future, a view model is required, then the changes are super easy
//

export class OfficerLeaveToViewModelMapper implements IMapper<OfficerLeave, OfficerLeave> {
   map(input: OfficerLeave) : OfficerLeave {
      return input;
   }
}

export class ViewModelToOfficerLeaveMapper implements IMapper<OfficerLeave, OfficerLeave> {
   map(input: OfficerLeave): OfficerLeave {
      return input;
   }
}