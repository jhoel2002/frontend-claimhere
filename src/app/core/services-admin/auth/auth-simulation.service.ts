import { Injectable} from '@angular/core';
import { BehaviorSubject, delay, Observable, of, throwError } from 'rxjs';
import { AuthResponse } from '../../models/auth-response.model';
import { AuthData } from '../../models/auth-data.model';
import { IAuthService } from './IAuth.service';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub: string;
  authorities: string;
  exp: number;
  buffet: string;
  user: string;
}

const MOCK_USERS: Array<{
  email: string;
  password: string;
  role: string;
  buffet: string;
  user: string;
  }> = [
    {
      email: 'admin@gmail.com',
      password: '12345',
      role: 'ROLE_ADMINISTRATOR',
      buffet: 'CENTRAL',
      user: 'zxcv',
    },
    {
      email: 'coordinador@gmail.com',
      password: '12345',
      role: 'ROLE_COORDINATOR',
      buffet: 'NORTE',
      user: 'asda',
    },
    {
      email: 'lawyer@gmail.com',
      password: '12345',
      role: 'ROLE_LAWYER',
      buffet: 'NORTE',
      user: 'qweq',
    },
    {
      email: '  ',
      password: '12345',
      role: 'ROLE_LEGALCODE',
      buffet: 'XXXX',
      user: 'qweq',
    }
  ];


@Injectable({
  providedIn: 'root'
})
export class AuthSimulationService implements IAuthService {

  private static readonly TOKEN_KEY = 'token';

  private currentUserData$ = new BehaviorSubject<AuthResponse>({
    username: '',
    role: '',
    token: '',
    buffet: '',
    user: '',
  });
  private currentUserLoginOn$ = new BehaviorSubject<boolean>(false);

  constructor() {
    const token = localStorage.getItem(AuthSimulationService.TOKEN_KEY);
    if (token && !this.isExpired(token)) {
      const userData = this.decodeToken(token);
      this.currentUserData$.next({ ...userData, token });
      this.currentUserLoginOn$.next(true);
    }
  }

  /** Simula el inicio de sesión contra usuarios locales. */
  login(credentials: AuthData): Observable<AuthResponse> {
    const { email, password } = credentials;
    const matched = MOCK_USERS.find(
      (u) => u.email === email && u.password === password,
    );

    if (!matched) {
      return throwError(() => 'Credenciales incorrectas.').pipe(delay(600));
    }

    const token = this.generateMockToken(matched);

    // Persistencia local para que sobreviva al refresh
    localStorage.setItem(AuthSimulationService.TOKEN_KEY, token);

    // Actualiza los observers
    const userData = this.decodeToken(token);
    this.currentUserData$.next({ ...userData, token });
    this.currentUserLoginOn$.next(true);

    // Emula latencia de red (500 ms) y devuelve la respuesta
    return of({ ...userData, token }).pipe(delay(500));
  }

  /** Cierra sesión y limpia almacenamiento. */
  logout(): void {
    localStorage.removeItem(AuthSimulationService.TOKEN_KEY);
    this.currentUserData$.next({ username: '', role: '', token: '', buffet: '', user: '' });
    this.currentUserLoginOn$.next(false);
  }

  /** Comprueba si el token está expirado. */
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

  /** Genera un JWT falso (base64 sin firma real). */
  private generateMockToken(user: {
    email: string;
    role: string;
    buffet: string;
    user: string;
  }): string {
    const header = {
      alg: 'HS256',
      typ: 'JWT',
    };

    const payload: JwtPayload & {
      authorities: string;
      buffet: string;
      user: string;
    } = {
      sub: user.email,
      authorities: JSON.stringify([{ authority: user.role }]),
      buffet: user.buffet,
      user: user.user,
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 h
    };

    const base64 = (obj: object) => btoa(JSON.stringify(obj));
    return `${base64(header)}.${base64(payload)}.MOCKSIG`;
  }

  /** Extrae los datos del token para exponerlos a la aplicación. */
  private decodeToken(token: string): {
    username: string;
    role: string;
    buffet: string;
    user: string;
  } {
    const payload = jwtDecode<JwtPayload & { authorities: string; buffet: string; user: string }>(token);
    let role = '';
    let buffet = '';
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
      username: payload.sub || '',
      role,
      buffet,
      user,
    };
  }

  // === Getters públicos para imitar la API del AuthService real ===

  get userData$(): Observable<AuthResponse> {
    return this.currentUserData$.asObservable();
  }

  get userLoginOn(): Observable<boolean> {
    return this.currentUserLoginOn$.asObservable();
  }

  get userToken(): string {
    return this.currentUserData$.value.token;
  }

  get userBuffet(): string {
    return this.currentUserData$.value.buffet;
  }

  get userRole(): string {
    return this.currentUserData$.value.role;
  }

  get userCode(): string {
    return this.currentUserData$.value.user;
  }

  /** Versión simplificada de isTokenValid para el modo mock. */
  isTokenValid(): boolean {
    const token = this.userToken;
    return token ? !this.isExpired(token) : false;
  }

}
