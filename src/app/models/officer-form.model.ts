export class OfficerForm {

  public agency: string;
  public badgeNumber: string;
  public startDate: Date;
  public endDate: Date;
  public leaveName: string;
  
  constructor(init?: Partial<OfficerForm>) {
    Object.assign(this, init);
  }
}
