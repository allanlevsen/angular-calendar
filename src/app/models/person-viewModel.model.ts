export class PersonViewModel {
   id: number;
   fullName: string;
   dateOfBirth: string; // Using string for simplicity in this example
   email: string;
 
   constructor(id: number, fullName: string, dateOfBirth: string, email: string) {
     this.id = id;
     this.fullName = fullName;
     this.dateOfBirth = dateOfBirth;
     this.email = email;
   }
 }

 