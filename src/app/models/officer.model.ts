export class Leave {

  constructor(
    public officerId: number,
    public startDate: Date,
    public endDate: Date,
    public leaveCode: string,
    public leaveName: string
  ) { }
}

export class Officer {

   constructor(
     public id: number,
     public agency: string,
     public badgeNumber: string,
     public firstName: string,
     public lastName: string,
     public leaves: Leave[]
   ) {  }
 
 }

 export class OfficerForm {

  public agency: string;
  public badgeNumber: string;
  public startDate: Date;
  public endDate: Date;
  public leaveType: string;
  
 }