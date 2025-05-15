import { Routes } from '@angular/router';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { LoginComponent } from './auth/login/login.component';

export const routes: Routes = [
    {
      path: 'login',
      component: LoginComponent
    },
    {
      path: '',
      loadComponent: () => import('./layouts/layout.component').then(m => m.LayoutComponent),
      loadChildren: () => import('./pages/pages.routes').then(m => m.
        PAGE_ROUTES),
    },
    {
      path: '**',
      component: NotFoundComponent,
    }
];
