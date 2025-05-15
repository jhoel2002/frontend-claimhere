import { Component, inject } from '@angular/core';
import { DateTableComponent } from '../../shared/shared-admin/components-admin/date-table/date-table.component';
import { DataTableColumn } from '../../core/core-admin/models-admin/datatable-column.model';
import { UserService } from '../../core/core-admin/services-admin/user/user.service';
import { DataUser } from '../../core/core-admin/models-admin/data-user.model';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@Component({
  selector: 'app-user-admin',
  standalone: true,
  imports: [DateTableComponent],
  templateUrl: './user-admin.component.html',
  styleUrl: './user-admin.component.css'
})
export class UserAdminComponent {

  userService = inject(UserService);

  columns: DataTableColumn[] = [
    { label: 'Nombre', dataKey: 'name' },
    { label: 'Apellido', dataKey: 'last_name' },
    { label: 'Correo', dataKey: 'email'},
    { label: 'Telefono', dataKey: 'phone' },
    { label: 'Rol', dataKey: 'role' },
    { label: 'Direccion', dataKey: 'address' },
    { label: 'Fecha de Creacion', dataKey: 'creation' },
  ];

  data: DataUser[] = [];

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests() {
    this.userService.getAll().subscribe((data) => {
      this.data = data;
    });
  }
}
