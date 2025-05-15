import { inject} from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
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
