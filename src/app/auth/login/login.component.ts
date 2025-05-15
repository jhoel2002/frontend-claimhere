import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services-admin/auth/auth.service';

import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthData } from '../../core/models/auth-data.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  errorMessage: string = '';

  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);

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

  // Método optimizado para el login usando Observables y subscribe()
  onLogin(): void {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Por favor, completa todos los campos correctamente.';
      return;
    }

    const credentials: AuthData = this.loginForm.value as AuthData;

    this.authService.login(credentials).subscribe({
      next: (response) => {
      },
      error: (error) => {
        // Manejo detallado de errores
        if (error.status === 401) {
          this.errorMessage = 'Credenciales incorrectas. Inténtalo nuevamente.';
        } else {
          this.errorMessage = 'Error al iniciar sesión. Por favor, inténtalo más tarde.';
        }
      },
      complete: () => {
        // Es importante que el spinner se oculte después de completar la solicitud
          this.router.navigate(['/admin/user']);
      }
    });
  }
}
