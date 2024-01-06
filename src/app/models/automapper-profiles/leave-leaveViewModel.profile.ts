import { LeaveViewModel } from "../leave-viewModel.model";
import { Leave } from '../leave.model';
import { IMapper } from "../IMapper.interface";

 export class LeaveToViewModelMapper implements IMapper<Leave, LeaveViewModel> {
   map(input: Leave): LeaveViewModel {

      return new LeaveViewModel({
         leaveId: input.leaveId,
         officerId: input.officerId,
         startDate: input.startDate,
         endDate: input.endDate,
         leaveCode: input.leaveCode,
         leaveName: input.leaveName
      });
    }
 }
 
 export class ViewModelToLeaveMapper implements IMapper<LeaveViewModel, Leave> {
   map(input: LeaveViewModel): Leave {
      return new Leave({
         leaveId: input.leaveId,
         officerId: input.officerId,
         startDate: input.startDate,
         endDate: input.endDate,
         leaveCode: input.leaveCode,
         leaveName: input.leaveName
      });
    }
 }
