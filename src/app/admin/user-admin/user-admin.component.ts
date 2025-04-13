import { Component } from '@angular/core';
import { DateTableComponent } from '../../shared/components/date-table/date-table.component';
import { DataTableColumn } from '../../core/models/datatable-column.model';

@Component({
  selector: 'app-user-admin',
  standalone: true,
  imports: [DateTableComponent],
  templateUrl: './user-admin.component.html',
  styleUrl: './user-admin.component.css'
})
export class UserAdminComponent {

  columns: DataTableColumn[] = [
    { label: 'Nombre de Usuario', dataKey: 'nombreUsuario' },
    { label: 'Correo', dataKey: 'correo'},
    { label: 'Rol', dataKey: 'rol' },
  ];

  data: any[] = [];
}
