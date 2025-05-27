import { Routes } from '@angular/router';
import { PendingRequestComponent } from './pending-request/pending-request.component';
import { AcceptedRequestComponent } from './accepted-request/accepted-request.component';
import { RejectedRequestComponent } from './rejected-request/rejected-request.component';
import { NotFoundComponent } from '../not-found/not-found.component';

export const REQUEST_ROUTES: Routes = [
      {
        path: 'pending',
        title: 'Claim Here | Solicitudes Pendientes',
        component: PendingRequestComponent,
      },
      {
        path: 'accepted',
        title: 'Legal Code | Solicitudes Aceptados',
        component: AcceptedRequestComponent,
      },
      {
        path: 'rejected',
        title: 'Claim Here | Solicitudes Rechazados',
        component: RejectedRequestComponent,
      },
      {
        path: '**',
        component: NotFoundComponent
      }
];
