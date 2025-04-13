import { Component } from '@angular/core';
import { DateTableComponent } from '../../shared/components/date-table/date-table.component';
import { DataTableColumn } from '../../core/models/datatable-column.model';

@Component({
  selector: 'app-customer-admin',
  standalone: true,
  imports: [DateTableComponent],
  templateUrl: './customer-admin.component.html',
  styleUrl: './customer-admin.component.css'
})
export class CustomerAdminComponent {

  columns: DataTableColumn[] = [
    { label: 'Tipo de Documento', dataKey: 'tipoDocIdentidad' },
    { label: 'Documento', dataKey: 'docIdentidad' },
    { label: 'Nombres', dataKey: 'nombres' },
    { label: 'Apellidos', dataKey: 'apellidos' },
    { label: 'Correo', dataKey: 'correo' },
  ];
  data: any[] = [];
}
