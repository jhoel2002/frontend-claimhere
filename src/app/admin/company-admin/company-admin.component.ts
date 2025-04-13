import { Component } from '@angular/core';
import { DateTableComponent } from "../../shared/components/date-table/date-table.component";
import { DataTableColumn } from '../../core/models/datatable-column.model';

@Component({
  selector: 'app-company-admin',
  standalone: true,
  imports: [DateTableComponent],
  templateUrl: './company-admin.component.html',
  styleUrl: './company-admin.component.css'
})
export class CompanyAdminComponent {

  columns: DataTableColumn[] = [
    { label: 'Imagen', dataKey: 'imageLogo' },
    { label: 'RUC', dataKey: 'ruc' },
    { label: 'Nombre', dataKey: 'nombreComercial' },
    { label: 'Correo', dataKey: 'correoContacto' },
    { label: 'Puntuacion', dataKey: 'promedioPuntuacion' },
    { label: 'Reclamos', dataKey: 'totalReclamos' },
  ];
 
  data: any[] = [];
}
