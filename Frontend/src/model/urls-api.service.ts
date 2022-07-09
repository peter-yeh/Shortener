import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_URL } from '../../env';
import { Url } from './url.model';

@Injectable()
export class UrlsApiService {

    constructor(private http: HttpClient) {
    }

    private static _handleError(err: HttpErrorResponse | any) {
        return throwError(() => err.message || 'Error: Unable to complete request.');
    }

    // GET list of public, future events
    getUrls(): Observable<any> {
        return this.http
            .get(`${API_URL}/stats`);
    }
}
