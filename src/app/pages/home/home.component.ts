import { Component } from '@angular/core';
import { HeaderHomeComponent } from '../../shared/shared-home/components-home/header-home/header-home.component';
import { Section1HomeComponent } from "../../shared/shared-home/components-home/section1-home/section1-home.component";
import { SectionCardComponent } from "../../shared/shared-home/components-home/section-card/section-card.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderHomeComponent, Section1HomeComponent, SectionCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
}
