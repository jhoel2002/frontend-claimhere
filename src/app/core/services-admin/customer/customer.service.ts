import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { DataCustomer } from '../../models/data-customer.model';
import { environment } from '../../../../environments/environment';
import { nameEndpints } from '../../name-enpoints/name-endpoints';
import { Page } from '../../models/pageable.model';
import { Customer } from '../../models/customer.model';
import { ICustomerService } from './ICustomerService';

@Injectable({
  providedIn: 'root'
})
export class CustomerService implements ICustomerService {
  private http = inject(HttpClient);

  getAll(page: number, size: number): Observable<Page<Customer>> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString()).set('sort', 'asc');
    const url: string = `${environment.baseUrl}${nameEndpints.customerEndpoint}`;
    return this.http.get<Page<Customer>>(url, { params })
      .pipe(catchError(this.handleError));
  }

  getCustomerBysearch(searchText: string, page: number, size: number): Observable<Page<Customer>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', 'asc')
      .set('search', searchText);
    const url: string = `${environment.baseUrl}${nameEndpints.customerEndpoint}/listFilterSearch`;
    return this.http.get<Page<Customer>>(url, { params })
      .pipe(catchError(this.handleError));
  }

  getCustomersByDateRange(start: string, end: string, page: number, size: number): Observable<Page<Customer>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', 'asc')
      .set('startDate', start)
      .set('endDate', end);
    const url: string = `${environment.baseUrl}${nameEndpints.customerEndpoint}/listFilterCreationDate`;
    return this.http.get<Page<Customer>>(url, { params })
      .pipe(catchError(this.handleError));
  }

  getCustomersBySearchAndDate(searchText: string, start: string, end: string, page: number, size: number): Observable<Page<Customer>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', 'asc')
      .set('startDate', start)
      .set('endDate', end)
      .set('search', searchText);
    const url: string = `${environment.baseUrl}${nameEndpints.customerEndpoint}/listFilterFull`;
    return this.http.get<Page<Customer>>(url, { params })
      .pipe(catchError(this.handleError));
  }

  register(customerData: Customer): Observable<any> {
    return this.http.post<any>(
      `${environment.baseUrl}${nameEndpints.customerEndpoint}/register`, 
      customerData
    ).pipe(catchError(this.handleError));
  }

  update(customerId: number, customerData: Customer): Observable<any> {
    return this.http.put<any>(
      `${environment.baseUrl}api/${nameEndpints.customerEndpoint}/update?idCustomer=${customerId}`,
      customerData
    ).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Algo falló. Por favor intente nuevamente.';
    if (error.status === 409) {
      errorMessage = 'El correo ya está registrado en el sistema.';
    }
    return throwError(() => errorMessage);
  }
}
