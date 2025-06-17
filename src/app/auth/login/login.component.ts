import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services-admin/auth/auth.service';

import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthData } from '../../core/models/auth-data.model';
import { AUTH_SERVICE_TOKEN } from '../../core/models/token-injection.model';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  errorMessage: string = '';

  fb = inject(FormBuilder);
  authService = inject(AUTH_SERVICE_TOKEN);
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

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Por favor, completa todos los campos correctamente.';
      return;
    }

    const credentials: AuthData = this.loginForm.value as AuthData;
    this.authService.login(credentials).subscribe({
      next: () => {
        const buffet = this.authService.userBuffet;
        this.router.navigate([`/${buffet}/request/pending`]);
      },
      error: (error) => {
        this.errorMessage = error;
      }
    });
  }
}
