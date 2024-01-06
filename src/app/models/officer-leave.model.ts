// This class is used to add or update an officer leave to the backend
//
// the properties may change

export class OfficerLeave {

  public officerLeaveId: number;
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

  constructor(init?: Partial<OfficerLeave>) {
    Object.assign(this, init);
  }

}
