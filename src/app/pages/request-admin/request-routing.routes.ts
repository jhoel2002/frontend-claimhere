import { Routes } from '@angular/router';
import { PendingRequestComponent } from './pending-request/pending-request.component';
import { AcceptedRequestComponent } from './accepted-request/accepted-request.component';
import { RejectedRequestComponent } from './rejected-request/rejected-request.component';
import { NotFoundComponent } from '../not-found/not-found.component';
import { UnauthorizedComponent } from '../unauthorized/unauthorized.component';
import { roleGuard } from '../../shared/guards/role.guard';

export const REQUEST_ROUTES: Routes = [
  {
    path: 'pending',
    title: 'Legal Code | Solicitudes Pendientes',
    component: PendingRequestComponent,
    canActivate: [roleGuard],
    data: { roles: ['ROLE_COORDINATOR', 'ROLE_ADMINISTRATOR'] }
  },
  {
    path: 'accepted',
    title: 'Legal Code | Solicitudes Aceptados',
    component: AcceptedRequestComponent,
    canActivate: [roleGuard],
    data: { roles: ['ROLE_COORDINATOR', 'ROLE_ADMINISTRATOR', 'ROLE_LAWYER'] }
  },
  {
    path: 'rejected',
    title: 'Legal Code | Solicitudes Rechazados',
    component: RejectedRequestComponent,
    canActivate: [roleGuard],
    data: { roles: ['ROLE_COORDINATOR', 'ROLE_ADMINISTRATOR'] }
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];
