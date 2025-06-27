import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { AUTH_SERVICE_TOKEN } from '../../core/models/token-injection.model';

/**
 * Evita el acceso a rutas protegidas si:
 * 1) el token falta o está expirado
 * 2) el prefijo de buffet en la URL no coincide con el buffet fijo del usuario
 */
export const loginGuard = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean | UrlTree => {
  const router       = inject(Router);
  const authService  = inject(AUTH_SERVICE_TOKEN);

  /* ---------- 1. token válido ---------- */
  if (!authService.isTokenValid()) {
    authService.logout();                 // limpia storage + subjects
    return router.parseUrl('/login');     // redirige al login
  }
  
  /* ---------- 2. buffet coincide ---------- */
  const buffetInUrl   = state.url.split('/')[1] ?? '';   // ej. "/XEV319/user"  → "XEV319"
  const userBuffet    = authService.userBuffet;  
  
  const userRole = authService.userRole;

  const isBuffetRole = ['ROLE_COORDINATOR', 'ROLE_ADMINISTRATOR', 'ROLE_LAWYER'].includes(userRole);

  if (isBuffetRole && buffetInUrl !== userBuffet) {
    return router.parseUrl('/unauthorized');
  }

  return true; // acceso permitido
};