import { Routes } from '@angular/router';
import { UserAdminComponent } from './user-admin/user-admin.component';
import { CompanyAdminComponent } from './company-admin/company-admin.component';
import { CustomerAdminComponent } from './customer-admin/customer-admin.component';

export const ADMIN_ROUTES: Routes = [
      {
        path: 'company',  // Ruta de login
        component: CompanyAdminComponent,
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
        path: 'request',
        loadChildren: () => import('./request-admin/request-routing.routes').then(m => m.
          REQUEST_ROUTES),
      },
      {
        path: '**',  
        redirectTo: 'request/pending', 
      }
];
