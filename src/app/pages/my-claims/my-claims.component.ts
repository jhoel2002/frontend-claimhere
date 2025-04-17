import { Component } from '@angular/core';
import { SectionCardComponent } from '../../shared/shared-home/components-home/section-card/section-card.component';

@Component({
  selector: 'app-my-claims',
  standalone: true,
  imports: [SectionCardComponent],
  templateUrl: './my-claims.component.html',
  styleUrl: './my-claims.component.css'
})
export class MyClaimsComponent {

}
