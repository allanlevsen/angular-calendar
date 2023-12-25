import { LeaveTypeViewModel } from "../leave-type-viewModel.model";
import { LeaveType } from '../leave-type.model';
import { IMapper } from "../IMapper.interface";

 export class LeaveTypeToViewModelMapper implements IMapper<LeaveType, LeaveTypeViewModel> {
   map(input: LeaveType): LeaveTypeViewModel {
      return new LeaveTypeViewModel(
        input.id,
        input.name,
        input.description
      );
    }
 }
 
 export class ViewModelToLeaveTypeMapper implements IMapper<LeaveTypeViewModel, LeaveType> {
   map(input: LeaveTypeViewModel): LeaveType {
      return new LeaveType(
         input.id,
         input.name,
         input.description
      );
    }
 }
