import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CalendarComponent } from './calendar/calendar.component';
import { FormsModule } from '@angular/forms';
import { OfficerScheduleComponent } from './officer-schedule/officer-schedule.component';
import { ContainsStringDirective } from './shared/directives/custom-validators/contains-string.directive';
@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    OfficerScheduleComponent,
    ContainsStringDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
