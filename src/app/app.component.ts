import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'claimhere-front';

  ngOnInit(): void {
    console.log('Base URL:', environment.baseUrl);  // Debería mostrar la URL correcta según el entorno
  }
}
