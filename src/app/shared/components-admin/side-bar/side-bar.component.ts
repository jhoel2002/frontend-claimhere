import { Component, inject, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services-admin/auth/auth.service';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [ RouterLink],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {

  authService = inject(AuthService);
  router = inject(Router);

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
