import { Component, inject } from '@angular/core';
import { DataTableColumn } from '../../core/models/datatable-column.model';
import { Page } from '../../core/models/pageable.model';
import { Customer } from '../../core/models/customer.model';
import { ModalService } from '../../core/services-admin/modal/modal.service';
import { Observable } from 'rxjs';
import { CUSTOMER_SERVICE_TOKEN } from '../../core/models/token-injection.model';
import { EntityFilterComponent } from '../../shared/components-admin/entity-filter/entity-filter.component';
import { ModalCustomerFormComponent } from './modal-customer-form/modal-customer-form.component';
import { ModalEntityType } from '../../core/models/modal-entity-type';

@Component({
  selector: 'app-customer-admin',
  standalone: true,
  imports: [EntityFilterComponent, ModalCustomerFormComponent],
  templateUrl: './customer-admin.component.html',
  styleUrl: './customer-admin.component.css'
})
export class CustomerAdminComponent {

  entity: ModalEntityType = 'customer';

  modalService = inject(ModalService);
  customerService = inject(CUSTOMER_SERVICE_TOKEN);

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

  loadUsers = (
    search: string,
    start: string,
    end: string,
    page: number,
    size: number
  ): Observable<Page<Customer>> => {
    const hasDate = start !== '' && end !== '';
    const hasSearch = search.trim() !== '';

    if (hasDate && hasSearch) {
      return this.customerService.getCustomersBySearchAndDate(search, start, end, page, size);
    } else if (hasDate) {
      return this.customerService.getCustomersByDateRange(start, end, page, size);
    } else if (hasSearch) {
      return this.customerService.getCustomerBysearch(search, page, size);
    } else {
      return this.customerService.getAll(page, size);
    }
  };

  openModalRegister() {
    this.modalService.openModalForCreation(this.entity);
  }
}
