import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  success({
    title,
    message,
    html,
  }: {
    title?: string;
    message?: string;
    html?: string;
  }): Promise<any> {
    return Swal.fire({
      icon: 'success',
      title: title || '¡Correcto!',
      text: message || 'La acción se completó con éxito.',
      html: html || ``,
      confirmButtonText: `Aceptar`,
      confirmButtonColor: '#ff5220',
    });
  }

  error({
    title,
    message,
  }: {
    title?: string;
    message?: string;
  }): Promise<any> {
    return Swal.fire({
      icon: 'error',
      title: title || '¡Error!',
      text: message || 'Se produjo un error.',
    });
  }

  confirmAction({ confirmText }: { confirmText?: string }): Promise<any> {
    return Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción',
      icon: 'warning',
      confirmButtonColor: '#ff5220',
      confirmButtonText: confirmText || 'Sí, hazlo!',
      showCancelButton: true,
      cancelButtonColor: '#5a6268',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    });
  }
}
