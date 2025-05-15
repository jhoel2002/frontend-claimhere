import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideBarComponent } from '../shared/components-admin/side-bar/side-bar.component';

@Component({
  selector: 'app-layout-admin',
  standalone: true,
  imports: [RouterOutlet, SideBarComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  isCollapsed = false;
  onClickToggler(_: any) {
    this.isCollapsed = !this.isCollapsed;
  }
}
