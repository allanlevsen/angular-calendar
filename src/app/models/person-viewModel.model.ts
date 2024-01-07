export class PersonViewModel {
  
  id: number;
  fullName: string;
  dateOfBirth: string; // Using string for simplicity in this example
  email: string;

  constructor(init?: Partial<PersonViewModel>) {
    Object.assign(this, init);
  }
}

