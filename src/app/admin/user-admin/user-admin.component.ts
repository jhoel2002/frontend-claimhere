import { Component, inject } from '@angular/core';
import { DateTableComponent } from '../../shared/shared-admin/components-admin/date-table/date-table.component';
import { DataTableColumn } from '../../core/core-admin/models-admin/datatable-column.model';
import { UserService } from '../../core/core-admin/services-admin/user/user.service';
import { DataUser } from '../../core/core-admin/models-admin/data-user.model';

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
    { label: 'Nombre', dataKey: 'nombre_usuario' },
    { label: 'Apellido', dataKey: 'apellido_usuario' },
    { label: 'Correo', dataKey: 'correo_usuario'},
    { label: 'Rol', dataKey: 'tipo_usuario' },
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
