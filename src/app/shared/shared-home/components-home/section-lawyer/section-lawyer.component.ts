import { Component, OnInit } from '@angular/core';
import { CarrouselLawyerComponent } from '../../carrousel-lawyer/carrousel-lawyer.component';

@Component({
  selector: 'app-section-lawyer',
  standalone: true,
  imports: [CarrouselLawyerComponent],
  templateUrl: './section-lawyer.component.html',
  styleUrls: ['./section-lawyer.component.css']
})
export class SectionLawyerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
