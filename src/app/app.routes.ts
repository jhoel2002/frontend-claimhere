import { Routes } from '@angular/router';
import { LayoutComponent } from './layouts/layout-home/layout.component';
import { LayoutAdminComponent } from './layouts/layout-admin/layout-admin.component';

export const routes: Routes = [
    {
      path: 'auth',
      component: LayoutComponent,
      loadChildren: () => import('./auth/auth.routes').then(m => m.
        AUTH_ROUTES),
    },
    {
      path: 'admin',
      component: LayoutAdminComponent,
      loadChildren: () => import('./admin/admin.routes').then(m => m.
        ADMIN_ROUTES),
    },
    {
      path: '',
      component: LayoutComponent,
      loadChildren: () => import('./pages/page.routes').then(m => m.
        PAGE_ROUTES),
    },
    {
      path: '**', // Ruta para 404 o página no encontrada
      redirectTo: '',
    }
];
