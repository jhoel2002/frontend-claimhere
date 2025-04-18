import { Component } from '@angular/core';
import { HeaderHomeComponent } from '../../shared/shared-home/components-home/header-home/header-home.component';
import { Section1HomeComponent } from "../../shared/shared-home/components-home/section1-home/section1-home.component";
import { SectionLawyerComponent } from '../../shared/shared-home/components-home/section-lawyer/section-lawyer.component';
import { Section2HomeComponent } from "../../shared/shared-home/components-home/section2-home/section2-home.component";
import { SectionMapsComponent } from '../../shared/shared-home/components-home/section-maps/section-maps.component';
import { Section3HomeComponent } from '../../shared/shared-home/section3-home/section3-home.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderHomeComponent, Section1HomeComponent, SectionLawyerComponent, Section2HomeComponent, SectionMapsComponent, Section3HomeComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
}
