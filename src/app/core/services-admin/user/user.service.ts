import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, delay, Observable, of, throwError } from 'rxjs';
import { DataUser } from '../../models/data-user.model';
import { environment } from '../../../../environments/environment';
import { nameEndpints } from '../../name-enpoints/name-endpoints';
import { User } from '../../models/user.model';
import { Page } from '../../models/pageable.model';
import { IUserService } from './IUserService';

@Injectable({
  providedIn: 'root'
})
export class UserService implements IUserService {

  private http = inject(HttpClient);

  getAll(page: number, size: number): Observable<Page<User>> {
    const params = new HttpParams().set('page', page.valueOf()).set('size', size.valueOf());
    const url: string = `${environment.baseUrl}${nameEndpints.usuarioEndpoint}`;
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
    const params = new HttpParams().set('start', start).set('end', end).set('page', page.valueOf()).set('size', size.valueOf());
    const url: string = `${environment.baseUrl}${nameEndpints.usuarioEndpoint}/date-range`;
      return this.http.get<any>(url, { params })
        .pipe(catchError(this.handleError));
  }

  getUsersBySearchAndDate(searchText: string, start: string, end: string, page: number, size: number): Observable<Page<User>> {
    const params = new HttpParams().set('searchText', searchText).set('start', start).set('end', end).set('page', page.valueOf()).set('size', size.valueOf());
    const url: string = `${environment.baseUrl}${nameEndpints.usuarioEndpoint}/date-search`;
      return this.http.get<any>(url, { params })
        .pipe(catchError(this.handleError));
  }

  register(userData: User): Observable<any> {
      return this.http.post<any>(`${environment.baseUrl}${nameEndpints.usuarioEndpoint}/register`, userData)
      .pipe(catchError(this.handleError));
  }

  update(userId: number, userData: User): Observable<any>{
    return this.http
      .put<any>(
        `${environment.baseUrl}api/${nameEndpints.usuarioEndpoint}/update?idUser=${userId}`,userData)
      .pipe(catchError(this.handleError));
  }




  updatePerfil(usuarioData: DataUser): Observable<any>{
    return this.http
      .put<any>(
        `${environment.baseUrl}api/${nameEndpints.usuarioEndpoint}/updatePerfil`,usuarioData)
      .pipe(catchError(this.handleError));
  }

  delete(companyId: number, rol: string): Observable<any> {
    return this.http
      .delete(
        `${environment.baseUrl}api/${nameEndpints.usuarioEndpoint}/deleteUsuario?idUsuario=${companyId}&rol=${rol}`
      )
      .pipe(catchError(this.handleError));
  }

  findByCorreoUsuario(): Observable<DataUser> {
    return this.http
      .get<DataUser>(
        `${environment.baseUrl}api/${nameEndpints.usuarioEndpoint}/findUsuarioByCorreo`
      )
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
