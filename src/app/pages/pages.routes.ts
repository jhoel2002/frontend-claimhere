import { Routes } from '@angular/router';
import { UserAdminComponent } from './user-admin/user-admin.component';
import { CustomerAdminComponent } from './customer-admin/customer-admin.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { LawyerAdminComponent } from './lawyer-admin/lawyer-admin.component';
import { DashboardBuffetAdminComponent } from './dashboard-buffet-admin/dashboard-buffet-admin.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { roleGuard } from '../shared/guards/role.guard';

export const PAGE_ROUTES: Routes = [
  {
    path: 'dashboard',
    component: DashboardBuffetAdminComponent,
    canActivate: [roleGuard],
    data: { roles: ['ROLE_ADMINISTRATOR'] }
  },
  {
    path: 'request',
    loadChildren: () => import('./request-admin/request-routing.routes').then(m => m.
      REQUEST_ROUTES),
  },
  {
    path: 'lawyer',
    component: LawyerAdminComponent,
    canActivate: [roleGuard],
    data: { roles: ['ROLE_COORDINATOR', 'ROLE_ADMINISTRATOR'] }
  },
  {
    path: 'user',
    component: UserAdminComponent,
    canActivate: [roleGuard],
    data: { roles: ['ROLE_COORDINATOR', 'ROLE_ADMINISTRATOR'] }
  },
  {
    path: 'customer',
    component: CustomerAdminComponent,
    canActivate: [roleGuard],
    data: { roles: ['ROLE_COORDINATOR', 'ROLE_ADMINISTRATOR'] }
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];
