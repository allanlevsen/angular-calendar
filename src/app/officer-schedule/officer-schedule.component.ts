import { Component } from '@angular/core';
import { Officer } from '../models/officer.model';


@Component({
  selector: 'app-officer-schedule',
  templateUrl: './officer-schedule.component.html',
  styleUrls: ['./officer-schedule.component.css']
})
export class OfficerScheduleComponent {


  model = new Officer({id: 1, agency: 'EPS', badgeNumber: '998-26381', firstName: 'Allan', lastName: 'Levsen', leaves: null});
  submitted = false;

  onSubmit() { this.submitted = true; }

  showFormControls(form: any) {
    return form && form.controls.name &&
    form.controls.name.value;
  }
}
