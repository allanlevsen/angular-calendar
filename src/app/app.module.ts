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
import { TwoMonthCalendarComponent } from './two-month-calendar/two-month-calendar.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MockBackendInterceptor } from './shared/services/mock-backend-interceptor.service';
import { ApiService } from './shared/services/api.service';
import { PersonRepositoryService } from './shared/services/person-repository.service';
import { AutoMapperService } from './shared/services/auto-mapper.service';


@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    OfficerScheduleComponent,
    ContainsStringDirective,
    OfficerBulkEntryComponent,
    TwoMonthCalendarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    SchedulingService,
    ApiService,
    PersonRepositoryService,
    MockBackendInterceptor,
    AutoMapperService,

    { provide: HTTP_INTERCEPTORS, useClass: MockBackendInterceptor, multi: true },

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
