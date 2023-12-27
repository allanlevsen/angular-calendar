import { Leave } from "./leave.model";

export class OfficerViewModel {
   id: number;
   firstName: string;
   lastName: string; // Using string for simplicity in this example
   agency: string;
   badgeNumber: string;
   leaves: Leave[];
 
   constructor(id: number, agency: string, badgeNumber: string, firstName: string, lastName: string) {
     this.id = id;
     this.agency = agency;
     this.badgeNumber = badgeNumber;
     this.firstName = firstName;
     this.lastName = lastName;
   }
 }