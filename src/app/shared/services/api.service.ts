import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // allan todo: get these from the environment variables
  //
  private readonly baseUrl: string = 'http://localhost:4200/'; // Replace with your API URL
  private readonly requestTimeout = 3000; // Timeout in milliseconds, adjust as needed
  private readonly retryCount = 3; // Number of retries, adjust as needed

  constructor(private http: HttpClient) { }

  private handleError(error: any, endpoint: string) {
    let errorMessage = 'API call error';
    if (error instanceof TimeoutError) {
      errorMessage = `Request to ${endpoint} timed out`;
    }

    console.error(errorMessage, error);
    return throwError({ error, errorMessage });
  }

  get<T>(endpoint: string, params?: any): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`, { params })
      .pipe(
        timeout(this.requestTimeout),
        retry(this.retryCount),
        catchError(error => this.handleError(error, endpoint))
      );
  }

  post<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, body)
      .pipe(
        timeout(this.requestTimeout),
        retry(this.retryCount),
        catchError(error => this.handleError(error, endpoint))
      );
  }

  put<T>(endpoint: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, body)
      .pipe(
        timeout(this.requestTimeout),
        retry(this.retryCount),
        catchError(error => this.handleError(error, endpoint))
      );
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`)
      .pipe(
        timeout(this.requestTimeout),
        retry(this.retryCount),
        catchError(error => this.handleError(error, endpoint))
      );
  }
}

