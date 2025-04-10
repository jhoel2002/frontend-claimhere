import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
    {
      path: 'auth',
      loadChildren: () => import('./auth/auth.routes').then(m => m.
        AUTH_ROUTES),
    },
    {
      path: 'admin',
      loadChildren: () => import('./admin/admin.routes').then(m => m.
        ADMIN_ROUTES),
    },
    {
      path: '',
      loadChildren: () => import('./pages/page.routes').then(m => m.
        PAGE_ROUTES),
    },
    {
      path: '**', // Ruta para 404 o página no encontrada
      redirectTo: '',
    }
];
