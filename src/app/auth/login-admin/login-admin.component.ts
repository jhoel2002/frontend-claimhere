import { Component, inject, OnInit } from '@angular/core';
import { Form, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/core-admin/services-admin/auth/auth.service';

import { Router } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from '../../core/core-admin/services-admin/intercerptor/auth.interceptor';
import { AuthData } from '../../core/core-admin/models-admin/auth-data.model';

@Component({
  selector: 'app-login-admin',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule ],
  templateUrl: './login-admin.component.html',
  styleUrls: ['./login-admin.component.css'],
  providers: [
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
})
export class LoginAdminComponent {

  errorMessage: string = '';

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  get email() {
    return this.loginForm.get('email');
  }
  
  get password() {
    return this.loginForm.get('password');
  }

  onLogin(): void {
    const credentials: AuthData = this.loginForm.value as AuthData;
    this.authService.login(credentials).subscribe({
      next: (response) => {
        // Aquí puedes redirigir al usuario a otra página después de iniciar s  esión
        this.router.navigate(['/admin/user']);
      },
      error: (error) => {
        this.errorMessage = 'Error al iniciar sesión. Por favor, verifica tus credenciales.';
      }
    });
  }

}
