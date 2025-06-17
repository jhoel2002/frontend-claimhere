import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthResponse } from '../../models/auth-response.model';
import { AuthData } from '../../models/auth-data.model';
import { IAuthService } from './IAuth.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthSimulationService implements IAuthService {

  private static expirationTimeInSeconds: number = 1440; // 24 minutos
  private mockUser: AuthResponse = {
    token: 'mock-token-ergfadsgeasgeargaergergqreg',
    username: 'usuario.simulado',
    role: 'ROLE_ADMIN',
    buffet: 'BuffetSimulado',
    user: 'FGDSFGEFGER'
  };

  private currentUserData: BehaviorSubject<AuthResponse> = new BehaviorSubject<AuthResponse>(this.mockUser);
  private currentUserLoginOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  
  get userRole(): string {
    throw new Error('Method not implemented.');
  }

  login(credentials: AuthData): Observable<AuthResponse> {
    if (isPlatformBrowser(this.platformId)) {
      const expirationDate = Date.now() + AuthSimulationService.expirationTimeInSeconds * 1000;
      localStorage.setItem("token", this.mockUser.token);
      localStorage.setItem("user", JSON.stringify(this.mockUser));
      localStorage.setItem("expiration", JSON.stringify({ expDate: expirationDate }));
    }
    this.currentUserData.next(this.mockUser);
    this.currentUserLoginOn.next(true);
    return new BehaviorSubject<AuthResponse>(this.mockUser).asObservable();
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem("expiration");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    this.currentUserLoginOn.next(false);
    this.currentUserData.next({
      token: '',
      username: '',
      role: '',
      buffet: '',
      user: ''
    });
  }

  isTokenValid(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;
    const item = localStorage.getItem("expiration");
    if (item) {
      const expiration = JSON.parse(item).expDate;
      return expiration > Date.now();
    }
    return false;
  }

  get userData(): Observable<AuthResponse> {
    return this.currentUserData.asObservable();
  }

  get userLoginOn(): Observable<boolean> {
    return this.currentUserLoginOn.asObservable();
  }

  get userToken(): string {
    return this.currentUserData.value.token;
  }

  get userBuffet(): string {
    return this.currentUserData.value.buffet;
  }

}
