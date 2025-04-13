import { Component } from '@angular/core';
import { DateTableComponent } from "../../shared/components/date-table/date-table.component";

@Component({
  selector: 'app-company',
  standalone: true,
  imports: [DateTableComponent],
  templateUrl: './company.component.html',
  styleUrl: './company.component.css'
})
export class CompanyComponent {

}
