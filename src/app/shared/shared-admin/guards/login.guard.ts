import { inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../../../core/core-admin/services-admin/auth/auth.service'; // Asegúrate de que esta ruta sea la correcta

export const loginGuard = () => {
    const router = inject(Router);
    const authService = inject(AuthService);
    // Si el token es válido, se permite el acceso
    if (authService.isTokenValid()) {
      return true;
    }

    authService.logout(); // Cierra la sesión si el token no es válido
    // Si no está autenticado, redirige al login
    router.navigate(['/auth/loginAdmin']);
    return false;
}
