import { inject, Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerLoadingService } from '../spinner/spinner-loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const busyService = inject(SpinnerLoadingService);

  // Llamamos al método busy antes de hacer la petición
  busyService.busy();

  // Continuamos con la solicitud HTTP
  return next(req).pipe(
    finalize(() => {
      // Al finalizar la petición (sin importar si fue exitosa o fallida), se llama a idle
      busyService.idle();
    })
  );
};
