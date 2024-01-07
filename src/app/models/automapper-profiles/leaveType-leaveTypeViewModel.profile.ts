import { LeaveTypeViewModel } from "../leave-type-viewModel.model";
import { LeaveType } from '../leave-type.model';
import { IMapper } from "../IMapper.interface";
import { LeaveStylingService } from "src/app/shared/services/leave-styling.service";

export class LeaveTypeToViewModelMapper implements IMapper<LeaveType, LeaveTypeViewModel> {

  constructor(private leaveStylingService: LeaveStylingService) { }

  map(input: LeaveType): LeaveTypeViewModel {
    return new LeaveTypeViewModel({
      id: input.id,
      name: input.name,
      code: input.code,
      description: input.description,
      backgroundColor: this.leaveStylingService.getBackgroundColor(input.code)
    });
  }
}

export class ViewModelToLeaveTypeMapper implements IMapper<LeaveTypeViewModel, LeaveType> {

  constructor(private leaveStylingService: LeaveStylingService) { }

  map(input: LeaveTypeViewModel): LeaveType {
    return new LeaveType({
      id: input.id,
      name: input.name,
      code: input.code,
      description: input.description,
      backgroundColor: this.leaveStylingService.getBackgroundColor(input.code)
    });
  }
}
