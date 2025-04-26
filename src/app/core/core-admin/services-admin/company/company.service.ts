import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { DataCompany } from '../../models-admin/data-company.model';
import { nameEndpints } from '../../name-enpoints/name-endpoints';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  constructor(private http: HttpClient) {}

  getAll(estado: string): Observable<any> {
    return this.http
      .get<any>(
        `${environment.baseUrl}${nameEndpints.companyEndpoint}/getAllEmpresas/${estado}`
      )
      .pipe(catchError(this.handleError));
  }

  save(company: DataCompany): Observable<DataCompany> {
    return this.http
      .post<DataCompany>(
        `${environment.baseUrl}${nameEndpints.companyEndpoint}/saveEmpresa`,
        company
      )
      .pipe(catchError(this.handleError));
  }

  delete(companyId: number): Observable<any> {
    return this.http
      .delete(
        `${environment.baseUrl}${nameEndpints.companyEndpoint}/deleteEmpresa/${companyId}`
      )
      .pipe(catchError(this.handleError));
  }

  updateEmpresa(companyData: DataCompany): Observable<any> {
    return this.http
      .put(
        `${environment.baseUrl}${nameEndpints.companyEndpoint}/updateEmpresa`,
        companyData
      )
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Algo falló. Por favor intente nuevamente.';
    if(error.status === 409){
      errorMessage = 'La empresa no se pudo eliminar, debido a que tiene reclamos asociados';
    }
    return throwError(() => errorMessage);
  }
}
