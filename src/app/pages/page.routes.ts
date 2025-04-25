import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MyClaimsComponent } from './my-claims/my-claims.component';
import { CompanyComponent } from './company/company.component';
import { NotFoundComponent } from '../not-found/not-found.component';

export const PAGE_ROUTES: Routes = [
        {
            path: '',
            component: HomeComponent,
        },
        {
            path: 'my-claims',
            component: MyClaimsComponent,
        },
        {
            path: 'company',
            component: CompanyComponent,
        },
        {
            path: '**',
            component: NotFoundComponent
        }
];
