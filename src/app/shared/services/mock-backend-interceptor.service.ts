import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpRequest, HttpResponse, HTTP_INTERCEPTORS, HttpHandler } from '@angular/common/http';
import { Observable, of, mergeMap } from 'rxjs';
import { Person } from '../../models/person.model'; // Adjust the path as necessary


@Injectable()
export class MockBackendInterceptor implements HttpInterceptor {

   private persons: Person[] = [
      new Person(1, 'John', 'Doe', new Date('1990-01-01'), 'john.doe@example.com'),
      new Person(2, 'Jane', 'Doe', new Date('1991-02-01'), 'jane.doe@example.com')
      // ... other mock persons
   ];

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
      if (url.endsWith('/codetable/leavetypes') && method === 'GET') {
         return this.getLeaveTypes();
      }

      // Forward any non-mock requests
      return next.handle(request);
   }

   private getLeaveTypes(): Observable<HttpEvent<any>> {

      const leaveTypes = [
         { id: 1, description: '', name: 'First Watch', code: 'F' },
         { id: 2, description: '', name: 'Second Watch', code: 'S' },
         { id: 3, description: '', name: 'Third Watch', code: 'T' },
         { id: 4, description: '', name: 'Day Off', code: 'D' },
         { id: 5, description: '', name: 'Holiday', code: 'H' },
         { id: 6, description: '', name: 'Course', code: 'C' },
         { id: 7, description: '', name: 'Maternity Leave', code: 'M' },
         { id: 8, description: '', name: 'Unavailable', code: 'U' }
       ];  

      return of(new HttpResponse({ status: 200, body: leaveTypes }));
   }

   private addPerson(person: Person): Observable<HttpEvent<any>> {
      const newId = this.persons.length > 0 ? Math.max(...this.persons.map(p => p.personId)) + 1 : 1;
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


