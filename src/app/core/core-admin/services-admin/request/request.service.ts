import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, Subject, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { DataRequest } from '../../models-admin/data-request.model';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  private requestId = new Subject<number | null>();

  constructor(private http: HttpClient) {}

  setCurrentRequestId(id: number) {
    this.requestId.next(id);
  }

  getCurrentRequestId(): Observable<number | null> {
    return this.requestId.asObservable();
  }

  findById(id: number): Observable<DataRequest> {
    return this.http
      .get<DataRequest>(
        `${environment.baseUrl}${environment.requestEndpoint}/findById/${id}`
      )
      .pipe(catchError(this.handleError));
  }

  getAll(status: string): Observable<DataRequest[]> {
    return this.http
      .get<DataRequest[]>(
        `${environment.baseUrl}${environment.requestEndpoint}/getAllReclamosAdmin?estadoActual=${status}`
      )
      .pipe(catchError(this.handleError));
  }

  updateStatus(id: number, requestData: DataRequest): Observable<DataRequest> {
    return this.http
      .put<DataRequest>(
        `${environment.baseUrl}${environment.requestEndpoint}/updateEstadoReclamo?idReclamo=${id}&estado=${requestData.estadoActual}`,
        requestData
      )
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Algo falló. Por favor intente nuevamente.';
    return throwError(() => new Error(errorMessage));
  }
}
