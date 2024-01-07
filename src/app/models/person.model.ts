export class Person {
   personId: number;
   firstName: string;
   lastName: string;
   birthDate: Date;
   emailAddress: string;

   constructor(init?: Partial<Person>) {
    Object.assign(this, init);
  }
 }

 