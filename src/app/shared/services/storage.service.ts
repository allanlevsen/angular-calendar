import { Injectable } from '@angular/core';
import { LookupDataService } from './lookup-data.service';
import { LookupKey } from '../../models/look-keys.model';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
   providedIn: 'root'
})
export class StorageService {

   constructor(private lookupDataService: LookupDataService) { }

   get(key: LookupKey): Observable<any> {
      if (this.exists(key)) {
         return of(JSON.parse(localStorage.getItem(key.toString())));
      } else {
         return this.lookupDataService.fetchFromServer(key).pipe(
            tap(data => this.save(key, data))
         );
      }
   }

   // Save data to local storage
   public save(key: LookupKey, data: any): void {
      localStorage.setItem(key.toString(), JSON.stringify(data));
   }

   // Check if data exists in local storage
   public exists(key: LookupKey): boolean {
      return localStorage.getItem(key.toString()) !== null;
   }

   // Remove data from local storage
   public remove(key: LookupKey): void {
      localStorage.removeItem(key.toString());
   }

}
