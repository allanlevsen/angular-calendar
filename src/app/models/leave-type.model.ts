export class LeaveType {

  public id: number;
  public name: string;
  public code: string;
  public description: string;
  public backgroundColor: string;

  constructor(init?: Partial<LeaveType>) {
    Object.assign(this, init);
  }
}