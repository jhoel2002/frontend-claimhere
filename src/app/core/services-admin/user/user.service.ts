import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, delay, Observable, of, throwError } from 'rxjs';
import { DataUser } from '../../models/data-user.model';
import { environment } from '../../../../environments/environment';
import { nameEndpints } from '../../name-enpoints/name-endpoints';
import { User } from '../../models/user.model';
import { Page } from '../../models/pageable.model';
import { IUserService } from './IUserService';
import { AUTH_SERVICE_TOKEN } from '../../models/token-injection.model';

@Injectable({
  providedIn: 'root'
})
export class UserService implements IUserService {

  private http = inject(HttpClient);
  private authService = inject(AUTH_SERVICE_TOKEN)
    
  codebuffet: string = this.authService.userBuffet;

  getAll(page: number, size: number): Observable<Page<User>> {
    const params = new HttpParams().set('page', page.valueOf()).set('size', size.valueOf()).set('sort', "asc");
    const url: string = `${environment.baseUrl}${nameEndpints.usuarioEndpoint}/findAllAdmin/${this.codebuffet}`;
      return this.http.get<any>(url, {params: params})
        .pipe(catchError(this.handleError));
  }

  search(searchText: string, page: number, size: number): Observable<Page<User>> {
    const params = new HttpParams().set('search', searchText).set('page', page.valueOf()).set('size', size.valueOf());
    const url: string = `${environment.baseUrl}${nameEndpints.usuarioEndpoint}/search`;
      return this.http.get<any>(url, { params })
        .pipe(catchError(this.handleError));
  }

  getUsersByDateRange(start: string, end: string, page: number, size: number): Observable<Page<User>> {
    const params = new HttpParams().set('startDate', start).set('endDate', end).set('page', page.valueOf()).set('size', size.valueOf());
    const url: string = `${environment.baseUrl}${nameEndpints.usuarioEndpoint}/date-range`;
      return this.http.get<any>(url, { params })
        .pipe(catchError(this.handleError));
  }

  getUsersBySearchAndDate(searchText: string, start: string, end: string, page: number, size: number): Observable<Page<User>> {
    const params = new HttpParams().set('search', searchText).set('start', start).set('end', end).set('page', page.valueOf()).set('size', size.valueOf());
    const url: string = `${environment.baseUrl}${nameEndpints.usuarioEndpoint}/date-search`;
      return this.http.get<any>(url, { params })
        .pipe(catchError(this.handleError));
  }

  register(userData: User): Observable<any> {
      return this.http.post<any>(`${environment.baseUrl}${nameEndpints.usuarioEndpoint}/saveAdmin/${this.codebuffet}`, userData)
      .pipe(catchError(this.handleError));
  }

  update(userId: number, userData: User): Observable<any>{
    return this.http
      .put<any>(
        `${environment.baseUrl}${nameEndpints.usuarioEndpoint}/update?idUser=${userId}`,userData)
      .pipe(catchError(this.handleError));
  }

  disabled(code: string, enable: boolean): Observable<any>{
    return this.http
      .patch<any>(
        `${environment.baseUrl}${nameEndpints.usuarioEndpoint}/enable`, { code, enable })
      .pipe(catchError(this.handleError));
  }
  
  delete(code: string): Observable<any> {
    return this.http
      .delete<any>(
        `${environment.baseUrl}${nameEndpints.usuarioEndpoint}/delete/${code}`)
      .pipe(catchError(this.handleError));
  }
    
  private handleError(error:HttpErrorResponse){
    let errorMessage = 'Algo falló. Por favor intente nuevamente.';
    if (error.status === 403) {
      errorMessage ='Contraseña actual incorrecta';
    }
    if (error.status === 409) {
      errorMessage ='El correo ya está registrado en el sistema.';
    }
    if (error.status === 422) {
      errorMessage ='El correo o documento ya está registrado. Si ya es cliente y desea asignarlo como empleado o administrador, actualice su rol en la seccion Clientes';
    }
    return throwError(() => errorMessage);
  }
}
