

export class Leave {

  constructor(
    public officerId: number,
    public startDate: Date,
    public endDate: Date,
    public leaveCode: string,
    public leaveName: string
  ) { }
}
