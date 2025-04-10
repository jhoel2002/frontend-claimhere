import { RouterModule, Routes } from '@angular/router';
import { CompanyComponent } from '../pages/company/company.component';
import { UserAdminComponent } from './user-admin/user-admin.component';
import { LayoutComponent } from '../layouts/layout/layout.component';

export const ADMIN_ROUTES: Routes = [
      {
        path: 'company',  // Ruta de login
        component: CompanyComponent,
      },
      {
        path: 'user',
        component: UserAdminComponent,
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
