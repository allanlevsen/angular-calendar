import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LookupKey } from '../../models/look-keys.model';

@Injectable({
  providedIn: 'root'
})
export class LookupDataService {

  constructor(private http: HttpClient) {}

  fetchFromServer(key: LookupKey): Observable<any> {
    switch (key) {
      case LookupKey.PERSON_TYPE:
        return this.getPersonTypes();
      default:
        throw new Error(`No fetch method defined for key: ${key}`);
    }
  }

  private getPersonTypes(): Observable<any[]> {
    return this.http.get<any[]>('/api/person-types');
  }

}
