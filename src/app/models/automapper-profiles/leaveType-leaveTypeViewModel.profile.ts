import { LeaveTypeViewModel } from "../leave-type-viewModel.model";
import { LeaveType } from '../leave-type.model';
import { IMapper } from "../IMapper.interface";

 export class LeaveTypeToViewModelMapper implements IMapper<LeaveType, LeaveTypeViewModel> {
   map(input: LeaveType): LeaveTypeViewModel {
      return new LeaveTypeViewModel(
        input.id,
        input.name,
        input.code,
        input.description,
        this.getBackgroundColor(input.code)
      );
    }
    
    getBackgroundColor(code: string): string {
      const colorMap: { [key: string]: string } = {
        'F': '#acc5ff',
        'S': '#acc5ff',
        'T': '#acc5ff',
        'D': '#f97a7a',
        'H': '#f97a7a',
        'C': '#7ae8f9',
        'M': '#7af9d5',
        'U': '#919191'
      };
    
      return colorMap[code] || '#000';
    }
 }
 
 export class ViewModelToLeaveTypeMapper implements IMapper<LeaveTypeViewModel, LeaveType> {
   map(input: LeaveTypeViewModel): LeaveType {
      return new LeaveType(
         input.id,
         input.name,
         input.code,
         input.description,
         input.backgroundColor
      );
    }
 }
