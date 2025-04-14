import { Routes } from '@angular/router';

export const routes: Routes = [
    {
      path: 'auth',
      loadComponent: () => import('./layouts/layout-home/layout.component').then(m => m.LayoutComponent),
      loadChildren: () => import('./auth/auth.routes').then(m => m.
        AUTH_ROUTES),
    },
    {
      path: '**',
      loadComponent: () => import('./not-found/not-found.component').then(m => m.NotFoundComponent)
    },
    {
      path: 'admin',
      loadComponent: () => import('./layouts/layout-admin/layout-admin.component').then(m => m.LayoutAdminComponent),
      loadChildren: () => import('./admin/admin.routes').then(m => m.
        ADMIN_ROUTES),
    },
    {
      path: '',
      loadComponent: () => import('./layouts/layout-home/layout.component').then(m => m.LayoutComponent),
      loadChildren: () => import('./pages/page.routes').then(m => m.
        PAGE_ROUTES),
    }
];
