import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { DataUser } from '../../models/data-user.model';
import { environment } from '../../../../environments/environment';
import { AuthResponse } from '../../models/auth-response.model';
import { AuthData } from '../../models/auth-data.model';
import { nameEndpints } from '../../name-enpoints/name-endpoints';
import { isPlatformBrowser } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isBrowser: boolean;

  private static expirationTimeInSeconds: number = 1440;
  //1440 = 24 minutos
  currentUserData: BehaviorSubject<AuthResponse> =new BehaviorSubject<AuthResponse>({
    username: '',
    role: '',
    token: ''
  });

  currentUserLoginOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient,
     @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
        const user = this.getUser();
        const userData = user ? {
        username: user.username || "",
        role: user.roles ? user.roles[0] || "" : ""
      } : null;

      this.currentUserData = new BehaviorSubject<AuthResponse>({
        token: localStorage.getItem("token") || "",
        username: userData?.username || "",
        role: userData?.role || ""
      });
    }
  }

  login(credentials: AuthData): Observable<any> {
    // const headers = { 'skip-interceptor': 'true' };
    return this.http.post<any>(`${environment.baseUrl}login`, credentials).pipe(
      tap((userData: AuthResponse) => {
        localStorage.setItem("token", userData.token);
        localStorage.setItem("user", JSON.stringify(userData));
        
        const expirationDate = Date.now() + AuthService.expirationTimeInSeconds * 1000;
        localStorage.setItem("expiration", JSON.stringify({ expDate: expirationDate }));

        this.currentUserData.next(userData);
        this.currentUserLoginOn.next(true);
      }),
      map((userData: AuthResponse) => userData),
      catchError(this.handleError)
    );
  }

  logout(): void {
    localStorage.removeItem("expiration");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.currentUserLoginOn.next(false);
    this.currentUserData.next({
      token: '',
      username: '',
      role: ''
    });
  }

  isTokenValid(): boolean {
    const item = localStorage.getItem("expiration");
    if (item) {
      const expiration = JSON.parse(item).expDate;
      if (expiration > Date.now()) {
        return true;
      }
    }
    return false;
  }

  private getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Observar los datos del usuario
  get userData(): Observable<AuthResponse> {
    return this.currentUserData.asObservable();
  }

  // Observar si el usuario está autenticado
  get userLoginOn(): Observable<boolean> {
    return this.currentUserLoginOn.asObservable();
  }

  // Obtener el token del usuario
  get userToken(): string {
    return this.currentUserData.value.token;
  }

  // Manejo de errores
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Algo falló. Por favor intente nuevamente.';
    if (error.status === 403 || error.status === 500) {
      errorMessage = 'Credenciales incorrectas.';
    }
    return throwError(() => new Error(errorMessage));
  }
}
