// This class is used to add or update an officer leave to the backend
//
// the properties may change

export class OfficerLeave {

   public officerId: number;
   public firstName: string;
   public lastName: string;
   public badgeNumber: string;
   public agencyId: number;
   public agency: string;
   public startDate: Date;
   public endDate: Date;
   public leaveTypeId: number;
   public leaveTypeCode: string;
   public leaveTypeName: string;
 }