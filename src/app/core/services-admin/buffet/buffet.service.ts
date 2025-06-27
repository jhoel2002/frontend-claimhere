import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { nameEndpints } from '../../name-enpoints/name-endpoints';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { IBuffetService } from './IBuffet.service';

@Injectable({
  providedIn: 'root'
})
export class BuffetService implements IBuffetService{

  http = inject(HttpClient);

  register(formData: any): unknown {
    throw new Error('Method not implemented.');
  }
  update(arg0: string, formData: any): unknown {
    throw new Error('Method not implemented.');
  }
  getAll(page: number, size: number): import("rxjs").Observable<import("../../models/pageable.model").Page<import("../../models/buffet.model").Buffet>> {
    throw new Error('Method not implemented.');
  }
  getBuffetsBysearch(search: string, page: number, size: number): import("rxjs").Observable<import("../../models/pageable.model").Page<import("../../models/buffet.model").Buffet>> {
    throw new Error('Method not implemented.');
  }
  getBuffetByDateRange(start: string, end: string, page: number, size: number): import("rxjs").Observable<import("../../models/pageable.model").Page<import("../../models/buffet.model").Buffet>> {
    throw new Error('Method not implemented.');
  }
  getBuffetsBySearchAndDate(search: string, start: string, end: string, page: number, size: number): import("rxjs").Observable<import("../../models/pageable.model").Page<import("../../models/buffet.model").Buffet>> {
    throw new Error('Method not implemented.');
  }
  getTypeOfTaskByRequest(code: string): Observable<any> {
    throw new Error('Method not implemented.');
  }

  getTypeCasesByCode(code: string): Observable<string[]>{
    const url = `${environment.baseUrl}${nameEndpints.buffetEndpoint}/typeCases/${code}`;
    return this.http.get<any>(url).pipe(catchError(this.handleError));;
  }

  getTypeOfTaskByBuffet(code: string): Observable<any>{
    const url = `${environment.baseUrl}${nameEndpints.requestEndpoint}/getTypeTask/${code}`;
      return this.http.get<any>(url).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
      let errorMessage = 'Algo falló. Por favor intente nuevamente.';
      return throwError(() => errorMessage);
    }

}
