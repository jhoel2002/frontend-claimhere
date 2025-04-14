import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { DataUser } from '../../models-admin/data-user.model';
import { environment } from '../../../../../environments/environment';
import { AuthResponse } from '../../models-admin/auth-response.model';
import { AuthData } from '../../models-admin/auth-data.model';
import { nameEndpints } from '../../name-enpoints/name-endpoints';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private static expirationTimeInSeconds: number = 1440;
  //1440 = 24 minutos
  currentUserData: BehaviorSubject<AuthResponse> =new BehaviorSubject<AuthResponse>({
    user:{
      nombre_usuario: '',
      rol: ''
    } ,
    token: ''
  });
  currentUserLoginOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private getUser() {
    if (localStorage.getItem('user')) {
      let userStr = localStorage.getItem('user');
      return JSON.parse(userStr || "{}");
    }
    return null;
  }

    constructor(private http: HttpClient) {
      this.currentUserLoginOn= new BehaviorSubject<boolean>(localStorage.getItem("token") != null);

      const user = this.getUser();
      const usuario = user ? {
        nombreUsuario: user.nombreUsuario || "",
        rol: user.roles[0] || ""
      } : null;

      this.currentUserData=new BehaviorSubject<AuthResponse>(
        {
          token: localStorage.getItem("token") || "",
          user: usuario as DataUser
        });
    }

  login(credentials:AuthData):Observable<any>{
    const headers = { 'skip-interceptor': 'true'};
    return this.http.post<any>(environment.baseUrl+nameEndpints.authEndpoint+"/loginAdmin",credentials, {headers}).pipe(
      tap( (userData:AuthResponse) => {
        localStorage.setItem("token", userData.token);
        localStorage.setItem("user", JSON.stringify(userData.user));
        
        const expirationDate = Date.now() + AuthService.expirationTimeInSeconds * 1000;
        localStorage.setItem("expiration", JSON.stringify({expDate : expirationDate}))
        this.currentUserData.next(userData);
        this.currentUserLoginOn.next(true);
      }),
      map((userData: AuthResponse) => userData),
      catchError(this.handleError)
    );
  }

  logout():void{
    localStorage.removeItem("expiration");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.currentUserLoginOn.next(false);
  }

  isTokenValid(): boolean {
    const item = localStorage.getItem("expiration");
    if(item){
      if(JSON.parse(item).expDate > Date.now())
      {
        return true;
      };
    }
    return false;
  }

  get userData(): Observable<AuthResponse> {
    return this.currentUserData.asObservable();
  }

  get userLoginOn(): Observable<boolean>{
    return this.currentUserLoginOn.asObservable();
  }

  get userToken():String{
    return this.currentUserData.value.token;
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Algo falló. Por favor intente nuevamente.';
    if (error.status === 403 || error.status === 500) {
      errorMessage = 'Credenciales incorrectas.';
    }
    return throwError(() => errorMessage);
  }
}
