import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CalendarComponent } from './calendar/calendar.component';
import { FormsModule } from '@angular/forms';
import { OfficerScheduleComponent } from './officer-schedule/officer-schedule.component';
import { ContainsStringDirective } from './shared/directives/custom-validators/contains-string.directive';
import { OfficerBulkLeaveEntryComponent } from './officer-bulk-leave-entry/officer-bulk-leave-entry.component';
import { SchedulingService } from './shared/services/scheduling.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MockBackendInterceptor } from './shared/services/mock-backend-interceptor.service';
import { ApiService } from './shared/services/api.service';
import { PersonRepositoryService } from './shared/services/person-repository.service';
import { AutoMapperService } from './shared/services/auto-mapper.service';
import { LeaveStylingService } from './shared/services/leave-styling.service';

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    OfficerScheduleComponent,
    ContainsStringDirective,
    OfficerBulkLeaveEntryComponent
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
    LeaveStylingService,

    { provide: HTTP_INTERCEPTORS, useClass: MockBackendInterceptor, multi: true },

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
