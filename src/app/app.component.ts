import { Component } from '@angular/core';
import { environment } from '../environments/environment';

import { LayoutComponent } from './layouts/layout/layout.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'claimhere-front';

  ngOnInit(): void {
    console.log('Base URL:', environment.baseUrl);  // Debería mostrar la URL correcta según el entorno
  }
}
