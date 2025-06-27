import { Routes } from '@angular/router';
import { NotFoundComponent } from '../pages/not-found/not-found.component';
import { BuffetAdminComponent } from './buffet-admin/buffet-admin.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'buffet',
    component: BuffetAdminComponent
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];
