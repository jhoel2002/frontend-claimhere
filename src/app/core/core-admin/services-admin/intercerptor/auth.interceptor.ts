import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Obtén el token del servicio de autenticación
    const token = this.authService.userToken;

    // Si el token existe, agregarlo a la cabecera de la solicitud
    if (token) {
      // Clonar la solicitud y agregar la cabecera Authorization con el token
      const clonedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });

      // Continuar con la solicitud clonada
      return next.handle(clonedRequest);
    }

    // Si no hay token, continuar con la solicitud original
    return next.handle(req);
  }
}
