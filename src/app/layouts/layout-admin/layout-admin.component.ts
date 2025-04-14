import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideBarComponent } from '../../shared/shared-admin/components-admin/side-bar/side-bar.component';

@Component({
  selector: 'app-layout-admin',
  standalone: true,
  imports: [RouterOutlet, SideBarComponent],
  templateUrl: './layout-admin.component.html',
  styleUrl: './layout-admin.component.css'
})
export class LayoutAdminComponent {
  isCollapsed = false;
  onClickToggler(_: any) {
    this.isCollapsed = !this.isCollapsed;
  }
}
