import { Component } from '@angular/core';
import { DataTableColumn } from '../../core/models/datatable-column.model';
import { DataTableComponent } from '../../shared/components-admin/data-table/data-table.component';
import { Page } from '../../core/models/pageable.model';
import { Customer } from '../../core/models/customer.model';

@Component({
  selector: 'app-customer-admin',
  standalone: true,
  imports: [DataTableComponent],
  templateUrl: './customer-admin.component.html',
  styleUrl: './customer-admin.component.css'
})
export class CustomerAdminComponent {

  columns: DataTableColumn[] = [
    { label: 'Nombres', dataKey: 'name' },
    { label: 'Apellidos', dataKey: 'last_name' },
    { label: 'Tipo de Documento', dataKey: 'type_document' },
    { label: 'Documento', dataKey: 'document' },
    { label: 'Correo', dataKey: 'email' },
    { label: 'Telefono', dataKey: 'phone' },
    { label: 'Direccion', dataKey: 'address' },
    { label: 'Fecha de Creacion', dataKey: 'creation' }
  ];
  data: any[] = [];
}
