export class LeaveTypeViewModel {

  public id: number;
  public name: string;
  public code: string;
  public description: string;
  public backgroundColor: string;

  constructor(init?: Partial<LeaveTypeViewModel>) {
    Object.assign(this, init);
  }
}