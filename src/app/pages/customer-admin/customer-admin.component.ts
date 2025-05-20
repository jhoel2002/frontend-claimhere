import { Component } from '@angular/core';
import { DataTableColumn } from '../../core/models/datatable-column.model';
import { DataTableComponent } from '../../shared/components-admin/data-table/data-table.component';

@Component({
  selector: 'app-customer-admin',
  standalone: true,
  imports: [DataTableComponent],
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
