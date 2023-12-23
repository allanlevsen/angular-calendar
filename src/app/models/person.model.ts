export class Person {
   personId: number;
   firstName: string;
   lastName: string;
   birthDate: Date;
   emailAddress: string;
 
   constructor(personId: number, firstName: string, lastName: string, birthDate: Date, emailAddress: string) {
     this.personId = personId;
     this.firstName = firstName;
     this.lastName = lastName;
     this.birthDate = birthDate;
     this.emailAddress = emailAddress;
   }
 }

 