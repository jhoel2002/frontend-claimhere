import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LoginAdminComponent } from './login-admin/login-admin.component';

export const AUTH_ROUTES: Routes = [
    {
        path: 'loginAdmin',  // Ruta de login
        component: LoginAdminComponent,
      },
      {
        path: 'login',  // Ruta de login
        component: LoginComponent,
      },
      {
        path: 'register',  // Ruta de registro
        component: RegisterComponent,
      },
      {
        path: '**',  // Ruta wildcard para cualquier otra ruta desconocida
        redirectTo: 'login', 
      }
];
