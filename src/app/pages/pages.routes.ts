import { Routes } from '@angular/router';
import { UserAdminComponent } from './user-admin/user-admin.component';
import { CustomerAdminComponent } from './customer-admin/customer-admin.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { LawyerAdminComponent } from './lawyer-admin/lawyer-admin.component';

export const PAGE_ROUTES: Routes = [
  {
    path: 'request',
    loadChildren: () => import('./request-admin/request-routing.routes').then(m => m.
      REQUEST_ROUTES),
  },
  {
    path: 'lawyer',
    component: LawyerAdminComponent,
  },
  {
    path: 'user',
    component: UserAdminComponent,
  },
  {
    path: 'customer',
    component: CustomerAdminComponent,
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];
