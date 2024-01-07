import { Leave } from "./leave.model";

export class OfficerViewModel {
  isOfficerValid: boolean;
  id: number;
  firstName: string;
  lastName: string; // Using string for simplicity in this example
  agency: string;
  badgeNumber: string;
  leaves: Leave[];

  constructor(init?: Partial<OfficerViewModel>) {
    Object.assign(this, init);
  }
}