import { Component } from '@angular/core';
import { HeaderHomeComponent } from '../../shared/shared-home/components-home/header-home/header-home.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderHomeComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
}
