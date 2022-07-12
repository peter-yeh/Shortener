import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {API_URL} from '../../env';
import {Url} from './url.model';

@Injectable()
export class UrlsApiService {
  constructor(private http: HttpClient) {
  }

  private static _handleError(err: HttpErrorResponse | any) {
    return throwError(() => err.message || 'Error: Unable to complete request.');
  }

  // GET list of public, future events
  getUrls(): Observable<Url[]> {
    return this.http
        .get<Url[]>(`${API_URL}/stats`);
  }

  addUrl(url: string): Observable<string> {
    return this.http.post<string>(`${API_URL}/add`, {url: url});
  }
}
