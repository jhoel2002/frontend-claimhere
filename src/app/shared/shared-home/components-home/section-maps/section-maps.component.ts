import { Component, OnInit } from '@angular/core';
import { GoogleMapComponent } from '../../google-map/google-map.component';

@Component({
  selector: 'app-section-maps',
  standalone: true,
  imports: [GoogleMapComponent],
  templateUrl: './section-maps.component.html',
  styleUrls: ['./section-maps.component.css']
})
export class SectionMapsComponent {


}
