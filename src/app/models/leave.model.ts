

export class Leave {

  public leaveId: number;
  public officerId: number;
  public startDate: Date;
  public endDate: Date;
  public leaveCode: string;
  public leaveName: string;

  constructor(init?: Partial<Leave>) {
    Object.assign(this, init);
  }

}
