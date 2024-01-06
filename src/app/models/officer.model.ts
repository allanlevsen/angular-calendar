import { Leave } from "./leave.model";

export class Officer {

  id: number;
  agency: string;
  badgeNumber: string;
  firstName: string;
  lastName: string;
  leaves: Leave[] = [];

  constructor(init?: Partial<Officer>) {
    Object.assign(this, init);
  }

}


