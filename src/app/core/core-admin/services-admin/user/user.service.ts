import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { DataUser } from '../../models-admin/data-user.model';
import { environment } from '../../../../../environments/environment';
import { nameEndpints } from '../../name-enpoints/name-endpoints';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http = inject(HttpClient);

  getAll(): Observable<DataUser[]> {
      return this.http.get<DataUser[]>(
          `${environment.baseUrl}${nameEndpints.usuarioEndpoint}/getAllUserByAdminRol`
        )
        .pipe(catchError(this.handleError));
  }

  register(credentials: DataUser): Observable<any> {
      return this.http.post<any>(`${environment.baseUrl}${nameEndpints.usuarioEndpoint}/registerAdmin`, credentials)
      .pipe(catchError(this.handleError));
  }

  updateUsuario(usuarioData: DataUser): Observable<any>{
    return this.http
      .put<any>(
        `${environment.baseUrl}${nameEndpints.usuarioEndpoint}/updateUsuario`,usuarioData)
      .pipe(catchError(this.handleError));
  }

  updatePerfil(usuarioData: DataUser): Observable<any>{
    return this.http
      .put<any>(
        `${environment.baseUrl}${nameEndpints.usuarioEndpoint}/updatePerfil`,usuarioData)
      .pipe(catchError(this.handleError));
  }

  delete(companyId: number, rol: string): Observable<any> {
    return this.http
      .delete(
        `${environment.baseUrl}${nameEndpints.usuarioEndpoint}/deleteUsuario?idUsuario=${companyId}&rol=${rol}`
      )
      .pipe(catchError(this.handleError));
  }

  findByCorreoUsuario(): Observable<DataUser> {
    return this.http
      .get<DataUser>(
        `${environment.baseUrl}${nameEndpints.usuarioEndpoint}/findUsuarioByCorreo`
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
