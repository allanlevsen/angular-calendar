export class LeaveForm {

  public leaveName: string;
  public startDate: string;
  public endDate: string;
  public leaveCode: string;

  constructor(init?: Partial<LeaveForm>) {
    Object.assign(this, init);
  }
}
