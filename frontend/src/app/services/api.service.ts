import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // **** Constructor ****
  constructor(private http: HttpClient) {
  }

  post<T>(url: string, body: any, options?: any): Observable<T> {
    return this.http.post(`${ environment.apiUrl }${ url }`, body, options).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

}
