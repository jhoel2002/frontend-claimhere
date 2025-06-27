// src/app/guards/role.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { AUTH_SERVICE_TOKEN } from '../../core/models/token-injection.model';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AUTH_SERVICE_TOKEN);
  const router = inject(Router);

  const userRole = authService.userRole;
  const requiredRoles = route.data['roles'] as string[];
  return requiredRoles.includes(userRole)
    ? true
    : router.parseUrl('/unauthorized');
};