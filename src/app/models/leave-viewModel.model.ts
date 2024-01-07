export class LeaveViewModel {

   public isValid: boolean;
   public leaveId: number;
   public officerId: number;
   public startDate: Date;
   public endDate: Date;
   public leaveCode: string;
   public leaveName: string;

   constructor(init?: Partial<LeaveViewModel>) {
      Object.assign(this, init);
   }
}
