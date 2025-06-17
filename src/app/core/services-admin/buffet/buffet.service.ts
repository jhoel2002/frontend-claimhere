import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { nameEndpints } from '../../name-enpoints/name-endpoints';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BuffetService {

  http = inject(HttpClient);

  getTypeCasesByCode(code: string): Observable<string[]>{
    const url = `${environment.baseUrl}${nameEndpints.buffetEndpoint}/typeCases/${code}`;
    return this.http.get<any>(url).pipe(catchError(this.handleError));;
  }

  private handleError(error: HttpErrorResponse) {
        let errorMessage = 'Algo falló. Por favor intente nuevamente.';
        return throwError(() => errorMessage);
    }

}
