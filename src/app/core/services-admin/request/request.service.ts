import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, Subject, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { nameEndpints } from '../../name-enpoints/name-endpoints';
import { Page } from '../../models/pageable.model';
import { IRequestService } from './IRequest.service';
import { CaseRequest } from '../../models/case-request.model';
import { CaseRequestFull } from '../../models/case-request-full.model';
type Status = 'APPROVED' | 'REJECTED' | 'PENDING';

@Injectable({
  providedIn: 'root'
})
export class RequestService implements IRequestService {

  getRequestById(id: string): Observable<CaseRequestFull> {
    throw new Error('Method not implemented.');
  }

  private http = inject(HttpClient);

  private requestId = new Subject<number | null>();

  setCurrentRequestId(id: number) {
    this.requestId.next(id);
  }

  getAll(page: number, size: number): Observable<Page<CaseRequest>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', 'asc');
    const url = `${environment.baseUrl}${nameEndpints.requestEndpoint}`;
    return this.http.get<Page<CaseRequest>>(url, { params }).pipe(catchError(this.handleError));
  }

  getRequestsByStatus(page: number, size: number, status: Status): Observable<Page<CaseRequest>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', 'asc')
      .set('status', status);
    const url = `${environment.baseUrl}${nameEndpints.requestEndpoint}/listByStatus`;
    return this.http.get<Page<CaseRequest>>(url, { params }).pipe(catchError(this.handleError));
  }

  getRequestsBySearch(searchText: string, page: number, size: number, status: Status): Observable<Page<CaseRequest>> {
  const params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString())
    .set('sort', 'asc')
    .set('search', searchText)
    .set('status', status);
    
  const url: string = `${environment.baseUrl}${nameEndpints.requestEndpoint}/listFilterSearch`;
  
  return this.http.get<Page<CaseRequest>>(url, { params })
    .pipe(catchError(this.handleError));
}

  getRequestsByDateRange(start: string, end: string, page: number, size: number, status: Status): Observable<Page<CaseRequest>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', 'asc')
      .set('startDate', start)
      .set('endDate', end)
      .set('status', status);
    const url = `${environment.baseUrl}${nameEndpints.requestEndpoint}/listByDateRange`;
    return this.http.get<Page<CaseRequest>>(url, { params }).pipe(catchError(this.handleError));
  }

  getRequestsBySearchAndDate(searchText: string, start: string, end: string, page: number, size: number, status: Status): Observable<Page<CaseRequest>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', 'asc')
      .set('search', searchText)
      .set('startDate', start)
      .set('endDate', end)
      .set('status', status);
    const url = `${environment.baseUrl}${nameEndpints.requestEndpoint}/listFilterFull`;
    return this.http.get<Page<CaseRequest>>(url, { params }).pipe(catchError(this.handleError));
  }

  register(requestData: CaseRequest): Observable<any> {
    const url = `${environment.baseUrl}${nameEndpints.requestEndpoint}/register`;
    return this.http.post<any>(url, requestData).pipe(catchError(this.handleError));
  }

  update(requestId: number, requestData: CaseRequest): Observable<any> {
    const url = `${environment.baseUrl}${nameEndpints.requestEndpoint}/update?idRequest=${requestId}`;
    return this.http.put<any>(url, requestData).pipe(catchError(this.handleError));
  }








  
  getCurrentRequestId(): Observable<number | null> {
    return this.requestId.asObservable();
  }

  // findById(id: number): Observable<DataRequest> {
  //   return this.http
  //     .get<DataRequest>(
  //       `${environment.baseUrl}${nameEndpints.requestEndpoint}/findById/${id}`
  //     )
  //     .pipe(catchError(this.handleError));
  // }

  // getAll(status: string): Observable<DataRequest[]> {
  //   return this.http
  //     .get<DataRequest[]>(
  //       `${environment.baseUrl}${nameEndpints.requestEndpoint}/getAllReclamosAdmin?estadoActual=${status}`
  //     )
  //     .pipe(catchError(this.handleError));
  // }

  // updateStatus(id: number, requestData: DataRequest): Observable<DataRequest> {
  //   return this.http
  //     .put<DataRequest>(
  //       `${environment.baseUrl}${nameEndpints.requestEndpoint}/updateEstadoReclamo?idReclamo=${id}&estado=${requestData.estadoActual}`,
  //       requestData
  //     )
  //     .pipe(catchError(this.handleError));
  // }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Algo falló. Por favor intente nuevamente.';
    return throwError(() => new Error(errorMessage));
  }
}
