import { AfterViewInit, Component} from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgxSpinnerModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit{

  title = 'legalcode-front';

  private initialized = false;

  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    this.run();
    this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) this.run();
    });
  }

  private run(): void {
    if (this.initialized) return; 
    initFlowbite();
    this.initialized = true;
    setTimeout(() => (this.initialized = false));
  }
}

