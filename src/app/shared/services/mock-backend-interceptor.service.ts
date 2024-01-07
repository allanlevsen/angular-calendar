import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpRequest, HttpResponse, HTTP_INTERCEPTORS, HttpHandler } from '@angular/common/http';
import { Observable, of, mergeMap } from 'rxjs';
import { Person } from '../../models/person.model'; // Adjust the path as necessary
import { LeaveType } from 'src/app/models/leave-type.model';
import { OfficerLeave } from 'src/app/models/officer-leave.model';
import { Officer } from 'src/app/models/officer.model';



type FullName = {
   firstName: string;
   lastName: string;
 };
 
 const names: FullName[] = [
   { firstName: 'Emma', lastName: 'Johnson' },
   { firstName: 'Liam', lastName: 'Smith' },
   { firstName: 'Olivia', lastName: 'Williams' },
   { firstName: 'Noah', lastName: 'Brown' },
   { firstName: 'Ava', lastName: 'Jones' },
   { firstName: 'William', lastName: 'Garcia' },
   { firstName: 'Isabella', lastName: 'Miller' },
   { firstName: 'James', lastName: 'Davis' },
   { firstName: 'Sophia', lastName: 'Rodriguez' },
   { firstName: 'Logan', lastName: 'Martinez' }
 ];

@Injectable()
export class MockBackendInterceptor implements HttpInterceptor {

   
   private persons: Person[] = [
      new Person({ personId: 1, firstName: 'John', lastName: 'Doe', birthDate: new Date('1990-01-01'), emailAddress: 'john.doe@example.com'}),
      new Person({ personId: 2, firstName: 'Jane', lastName: 'Doe', birthDate: new Date('1991-02-01'), emailAddress: 'jane.doe@example.com'})
      // ... other mock persons
   ];

   private officerLeaves: OfficerLeave[] = [];

   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      // Simulate a network delay
      return of(null).pipe(mergeMap(() => this.handleRoute(request, next)));
   }

   private handleRoute(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const { url, method, body } = request;

      // Handle request for all persons
      if (url.endsWith('/persons') && method === 'GET') {
         return of(new HttpResponse({ status: 200, body: this.persons }));
      }
      // Handle request for a single person
      else if (url.match(/\/persons\/\d+$/) && method === 'GET') {
         const personId = parseInt(url.split('/').pop());
         const person = this.persons.find(p => p.personId === personId);
         return person
            ? of(new HttpResponse({ status: 200, body: person }))
            : of(new HttpResponse({ status: 404, body: { error: 'Person not found' } }));
      }
      // Handle POST request
      else if (url.endsWith('/persons') && method === 'POST') {
         return this.addPerson(body);
      }
      // Handle PUT request
      else if (url.match(/\/persons\/\d+$/) && method === 'PUT') {
         const personId = parseInt(url.split('/').pop());
         return this.updatePerson(personId, body);
      }
      // Handle DELETE request
      else if (url.match(/\/persons\/\d+$/) && method === 'DELETE') {
         const personId = parseInt(url.split('/').pop());
         return this.deletePerson(personId);
      }
      else if (url.endsWith('/codetable/leavetypes') && method === 'GET') {
         return this.getLeaveTypes();
      }
      else if (url.endsWith('officerLeave') && method === 'POST') {
         return this.addOfficerLeave(body);
      }
      else if ((url.includes('officer/EPS') || url.includes('officer/CPS')) && method === 'GET') {
         const urlArray: string[] = url.split('/');
         const badgeNumber = urlArray.pop();
         const agency = urlArray.pop();
         return this.getOfficer(agency, badgeNumber);
      }


      // Forward any non-mock requests
      return next.handle(request);
   }

   private getRandomName(): FullName {
      const randomIndex = Math.floor(Math.random() * names.length);
      const randomName = names[randomIndex];
      return randomName;
    }

   private getLeaveTypes(): Observable<HttpEvent<any>> {

      const leaveTypes = [
         new LeaveType({id: 1, name: 'First Watch', code: 'F', description: 'First Watch Description', backgroundColor: null}),
         new LeaveType({id: 2, name: 'Second Watch', code: 'S', description: 'Second Watch Description', backgroundColor: null}),
         new LeaveType({id: 3, name: 'Third Watch', code: 'T', description: 'Third Watch Description', backgroundColor: null}),
         new LeaveType({id: 4, name: 'Day Off', code: 'D', description: 'Day Off Description', backgroundColor: null}),
         new LeaveType({id: 5, name: 'Holiday', code: 'H', description: 'Holiday Description', backgroundColor: null}),
         new LeaveType({id: 6, name: 'Course', code: 'C', description: 'Course Description', backgroundColor: null}),
         new LeaveType({id: 7, name: 'Maternity Leave', code: 'M', description: 'Maternity Leave Description', backgroundColor: null}),
         new LeaveType({id: 8, name: 'Unavailable', code: 'U', description: 'Unavailable Description', backgroundColor: null})
      ];

      return of(new HttpResponse({ status: 200, body: leaveTypes }));
   }

   private addOfficerLeave(officerLeave: OfficerLeave): Observable<HttpEvent<any>> {
      const newId = this.officerLeaves.length > 0 ? Math.max(...this.officerLeaves.map(p => p.officerLeaveId)) + 1 : 1;
      officerLeave.officerLeaveId = newId;
      this.officerLeaves.push(officerLeave);
      return of(new HttpResponse({ status: 200, body: officerLeave as OfficerLeave }));
   }

   private getOfficer(agencyCode: string, officerBadgeNumber: string): Observable<HttpEvent<any>> {
      const newId = this.officerLeaves.length > 0 ? Math.max(...this.officerLeaves.map(p => p.officerLeaveId)) + 1 : 1;
      const newName: FullName = this.getRandomName();

      let newOfficer: Officer = new Officer({
         id: newId,
         agency: agencyCode,
         badgeNumber: officerBadgeNumber,
         firstName: newName.firstName,
         lastName: newName.lastName,
         leaves: []
      });

      return of(new HttpResponse({ status: 200, body: newOfficer as Officer }));
   }

   private addPerson(person: Person): Observable<HttpEvent<any>> {
      const newId = this.persons.length > 0 ? Math.max(...this.persons.map(p => p.personId)) + 1 :  1;
      person.personId = newId;
      this.persons.push(person);
      return of(new HttpResponse({ status: 200, body: person }));
   }

   private updatePerson(personId: number, person: Person): Observable<HttpEvent<any>> {
      const index = this.persons.findIndex(p => p.personId === personId);
      if (index !== -1) {
         this.persons[index] = { ...person, personId }; // Update the person
         return of(new HttpResponse({ status: 200, body: this.persons[index] }));
      }
      return of(new HttpResponse({ status: 404 }));
   }

   private deletePerson(personId: number): Observable<HttpEvent<any>> {
      const index = this.persons.findIndex(p => p.personId === personId);
      if (index !== -1) {
         this.persons.splice(index, 1);
         return of(new HttpResponse({ status: 200, body: { personId } }));
      }
      return of(new HttpResponse({ status: 404 }));
   }
}


