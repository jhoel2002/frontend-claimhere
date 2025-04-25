import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { DataCustomer } from '../../models-admin/data-customer.model';
import { environment } from '../../../../../environments/environment';
import { nameEndpints } from '../../name-enpoints/name-endpoints';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<DataCustomer[]> {
    return this.http
      .get<DataCustomer[]>(
        `${environment.baseUrl}${nameEndpints.clientEndpoint}/getAllClientes`
      )
      .pipe(catchError(this.handleError));
  }

  update(clientData: DataCustomer): Observable<any> {
    return this.http
      .put(
        `${environment.baseUrl}${nameEndpints.clientEndpoint}/updateClienteAdmin`,
        clientData
      )
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Algo falló. Por favor intente nuevamente.';
    if (error.status === 409) {
      errorMessage = 'El correo ya está registrado en el sistema.';
    }
    return throwError(() => errorMessage);
  }
}
