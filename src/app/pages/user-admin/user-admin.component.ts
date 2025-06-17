import { Component, inject, InjectionToken } from '@angular/core';
import { DataTableComponent } from '../../shared/components-admin/data-table/data-table.component';
import { DataTableColumn } from '../../core/models/datatable-column.model';
import { UserService } from '../../core/services-admin/user/user.service';
import { PaginationTableComponent } from '../../shared/components-admin/pagination-table/pagination-table.component';
import { SearchTableComponent } from '../../shared/components-admin/search-table/search-table.component';
import { DateRangeTableComponent } from '../../shared/components-admin/date-range-table/date-range-table.component';
import { User } from '../../core/models/user.model';
import { Observable } from 'rxjs';
import { Page } from '../../core/models/pageable.model';
import { ModalService } from '../../core/services-admin/modal/modal.service';
import { ModalUserFormComponent } from './modal-user-form/modal-user-form.component';
import { EntityFilterComponent } from '../../shared/components-admin/entity-filter/entity-filter.component';
import { USER_SERVICE_TOKEN } from '../../core/models/token-injection.model';
import { ModalEntityType } from '../../core/models/modal-entity-type';

@Component({
  selector: 'app-user-admin',
  standalone: true,
  // imports: [DataTableComponent, ModalUserFormComponent, DateRangeTableComponent, SearchTableComponent, PaginationTableComponent],
  imports: [EntityFilterComponent, ModalUserFormComponent],
  templateUrl: './user-admin.component.html',
  styleUrl: './user-admin.component.css'
})
export class UserAdminComponent {

  entity: ModalEntityType = 'user';
  isDisabled: boolean = false;

  userService = inject(USER_SERVICE_TOKEN);
  modalService = inject(ModalService);

  columns: DataTableColumn[] = [
    { label: 'Nombre', dataKey: 'name' },
    { label: 'Apellido', dataKey: 'last_name' },
    { label: 'Correo', dataKey: 'email' },
    { label: 'Teléfono', dataKey: 'phone' },
    { label: 'Rol', dataKey: 'role' },
    { label: 'Dirección', dataKey: 'address' },
    { label: 'Fecha de Creación', dataKey: 'creation' }
  ];

  loadCustomers = (
    search: string,
    start: string,
    end: string,
    page: number,
    size: number
  ): Observable<Page<User>> => {
    const hasDate = start !== '' && end !== '';
    const hasSearch = search.trim() !== '';

    if (hasDate && hasSearch) {
      return this.userService.getUsersBySearchAndDate(search, start, end, page, size);
    } else if (hasDate) {
      return this.userService.getUsersByDateRange(start, end, page, size);
    } else if (hasSearch) {
      return this.userService.search(search, page, size);
    } else {
      return this.userService.getAll(page, size);
    }
  };

  openModalRegister() {
    this.modalService.openModalForCreation(this.entity);
  }
}
