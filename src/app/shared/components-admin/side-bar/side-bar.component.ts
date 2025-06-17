import { Component, inject, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services-admin/auth/auth.service';
import { AUTH_SERVICE_TOKEN } from '../../../core/models/token-injection.model';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [ RouterLink, NgIf],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {

  authService = inject(AUTH_SERVICE_TOKEN);
  router = inject(Router);

  buffet: string = this.authService.userBuffet;
  role: string = this.authService.userRole;

  isDropdownOpen = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  @Input() isCollapsed = false;

  onClickLogout():void{
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
