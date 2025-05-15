import { Routes } from '@angular/router';
import { PendingRequestComponent } from './pending-request/pending-request.component';
import { AcceptedRequestComponent } from './accepted-request/accepted-request.component';
import { RejectedRequestComponent } from './rejected-request/rejected-request.component';
import { NotFoundComponent } from '../not-found/not-found.component';

export const REQUEST_ROUTES: Routes = [
      {
        path: 'pending',
        title: 'Claim Here | Reclamos Pendientes',
        component: PendingRequestComponent,
      },
      {
        path: 'accepted',
        title: 'Claim Here | Reclamos Aceptados',
        component: AcceptedRequestComponent,
      },
      {
        path: 'rejected',
        title: 'Claim Here | Reclamos Rechazados',
        component: RejectedRequestComponent,
      },
      {
        path: '**',
        component: NotFoundComponent
      }
];
