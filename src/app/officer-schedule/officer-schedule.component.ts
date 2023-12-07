import { Component } from '@angular/core';
import { Officer } from '../models/officer.model';

@Component({
  selector: 'app-officer-schedule',
  templateUrl: './officer-schedule.component.html',
  styleUrls: ['./officer-schedule.component.css']
})
export class OfficerScheduleComponent {


  model = new Officer(1, 'Allan', 'Levsen');
  submitted = false;

  onSubmit() { this.submitted = true; }

  showFormControls(form: any) {
    return form && form.controls.name &&
    form.controls.name.value;
  }
}
