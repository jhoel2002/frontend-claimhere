import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthResponse } from '../../models/auth-response.model';
import { AuthData } from '../../models/auth-data.model';
import { isPlatformBrowser } from '@angular/common';
import { IAuthService } from './IAuth.service';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub: string;
  authorities: string;
  exp: number;
  buffet: string;
  user: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService implements IAuthService {

  private http = inject(HttpClient);

  private static readonly TOKEN_KEY = 'token';

  currentUserData$: BehaviorSubject<AuthResponse> =new BehaviorSubject<AuthResponse>({
    username: '',
    role: '',
    token: '',
    buffet: '',
    user: ''
  });

  currentUserLoginOn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {
    const token = localStorage.getItem(AuthService.TOKEN_KEY);
      if (token && !this.isExpired(token)) {
        const userData = this.decodeToken(token);
        this.currentUserData$.next({ ...userData, token, buffet: userData.buffet,  user: userData.user });
        this.currentUserLoginOn$.next(true);
    }
  }
  private decodeToken(token: string): { username: string; role: string; user: string; buffet: string } {
    const payload = jwtDecode<JwtPayload>(token);
    let role = '';
    let buffet = ''; // Default value for buffet
    let user = '';
    try {
      const authoritiesArray = JSON.parse(payload.authorities) as { authority: string }[];
      role = authoritiesArray?.[0]?.authority || '';
      buffet = payload.buffet || '';
      user = payload.user || '';
    } catch (error) {
      console.warn('No se pudo parsear authorities del token:', error);
    }
    return {
      username: payload.sub,
      role,
      buffet,
      user
    };
  }

  login(credentials: AuthData): Observable<any> {
    // const headers = { 'skip-interceptor': 'true' };
    return this.http.post<any>(`${environment.baseUrl}login`, credentials).pipe(
      tap(({ token }) => {
        // Guarda sólo el token
        localStorage.setItem(AuthService.TOKEN_KEY, token);

        // Actualiza subjects
        const userData = this.decodeToken(token);
        this.currentUserData$.next({ ...userData, token, buffet: userData.buffet,  user: userData.user });
        this.currentUserLoginOn$.next(true);
      }),
      map(({ token }) => ({ ...this.decodeToken(token), token})),
      catchError(this.handleError)
    );
  }

  logout(): void {
    localStorage.removeItem(AuthService.TOKEN_KEY);
    this.currentUserData$.next({ username: '', role: '', token: '', buffet: '', user: '' });
    this.currentUserLoginOn$.next(false);
  }

  private isExpired(token: string): boolean {
    try {
      const { exp } = jwtDecode<JwtPayload>(token);
      if (typeof exp !== 'number') {
        return true;
      }
      return Date.now() / 1000 >= exp;
    } catch {
      return true;
    }
  }
  
  isTokenValid(): boolean {
    const token = this.userToken || localStorage.getItem(AuthService.TOKEN_KEY);
    return token ? !this.isExpired(token) : false;
  }

  // Observar los datos del usuario
  get userData(): Observable<AuthResponse> {
    return this.currentUserData$.asObservable();
  }

  // Observar si el usuario está autenticado
  get userLoginOn(): Observable<boolean> {
    return this.currentUserLoginOn$.asObservable();
  }

  // Obtener el token del usuario
  get userToken(): string {
    return this.currentUserData$.value.token;
  }

  // Obtener el buffet al que pertenece el usuario
  get userBuffet(): string {
    return this.currentUserData$.value.buffet;
  }

  // Obtener el rol del usuario
  get userRole(): string {
    return this.currentUserData$.value.role;
  }

  get userCode(): string {
    return this.currentUserData$.value.user;
  }

  // Manejo de errores
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Algo falló. Por favor intente nuevamente.';
    if (error.status === 403 || error.status === 401) {
      errorMessage = 'Credenciales incorrectas.';
    }
    return throwError(() => errorMessage);
  }
}
