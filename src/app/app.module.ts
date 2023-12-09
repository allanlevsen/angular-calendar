import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CalendarComponent } from './calendar/calendar.component';
import { FormsModule } from '@angular/forms';
import { OfficerScheduleComponent } from './officer-schedule/officer-schedule.component';
import { ContainsStringDirective } from './shared/directives/custom-validators/contains-string.directive';
import { OfficerBulkEntryComponent } from './officer-bulk-entry/officer-bulk-entry.component';
import { SchedulingService } from './shared/services/scheduling.service';
@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    OfficerScheduleComponent,
    ContainsStringDirective,
    OfficerBulkEntryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    SchedulingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
