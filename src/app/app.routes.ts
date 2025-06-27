import { Routes } from '@angular/router';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { LoginComponent } from './auth/login/login.component';
import { loginGuard } from './shared/guards/login.guard';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
import { roleGuard } from './shared/guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'admin',
    canActivate: [loginGuard, roleGuard],
    loadComponent: () => import('./layouts/layout.component').then(m => m.LayoutComponent),
    loadChildren: () => import('./admin/admin.routes').then(m => m.
      ADMIN_ROUTES),
    data: { roles: ['ROLE_LEGALCODE'] }
  },
  {
    path: ':buffet',
    canActivate: [loginGuard],
    loadComponent: () => import('./layouts/layout.component').then(m => m.LayoutComponent),
    loadChildren: () => import('./pages/pages.routes').then(m => m.
      PAGE_ROUTES),
  },
  {
    path: '**',
    component: NotFoundComponent,
  }
];
