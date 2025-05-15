import { inject, Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { HttpEvent, HttpHandler, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);  // Usamos inject() para obtener el servicio de autenticación

  // Obtén el token del servicio de autenticación
  const token = authService.userToken;

  // Si el token existe, agregarlo a la cabecera de la solicitud
  if (token) {
    // Clonamos la solicitud y agregamos el token en las cabeceras
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    // Continuamos con la solicitud clonada
    return next(clonedRequest);  // Se usa next() con la solicitud clonada
  }

  // Si no hay token, continuamos con la solicitud original
  return next(req);  // Continuamos con la solicitud original si no hay token
};