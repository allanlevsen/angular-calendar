import { Leave } from "./leave.model";

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


