import { Component, inject } from '@angular/core';
import { DataTableColumn } from '../../../core/models/datatable-column.model';
import { DataTableComponent } from '../../../shared/components-admin/data-table/data-table.component';
import { Observable } from 'rxjs';
import { Customer } from '../../../core/models/customer.model';
import { Page } from '../../../core/models/pageable.model';
import { ModalService } from '../../../core/services-admin/modal/modal.service';
import { REQUEST_SERVICE_TOKEN } from '../../../core/models/token-injection.model';
import { CaseRequest } from '../../../core/models/case-request.model';
import { ModalEntityType } from '../../../core/models/modal-entity-type';
import { EntityFilterComponent } from '../../../shared/components-admin/entity-filter/entity-filter.component';
import { ModalRequestViewComponent } from '../modal-request-view/modal-request-view.component';

@Component({
  selector: 'app-accepted-request',
  standalone: true,
  imports: [EntityFilterComponent, ModalRequestViewComponent],
  templateUrl: './accepted-request.component.html',
  styleUrl: './accepted-request.component.css'
})
export class AcceptedRequestComponent {

  entity: ModalEntityType = 'case-request';

  modalService = inject(ModalService);
  requestService = inject(REQUEST_SERVICE_TOKEN);
  isRequest:boolean = true;

  columns: DataTableColumn[] = [
    { label: 'Título del Caso', dataKey: 'title' },
    { label: 'Descripcion', dataKey: 'description' },
    { label: 'Tipo de Caso', dataKey: 'type_case' },
    { label: 'Cliente', dataKey: 'customer' },
    { label: 'Fecha de Creacion', dataKey: 'application_date' }
  ];

  loadUsers = (
    search: string,
    start: string,
    end: string,
    page: number,
    size: number
  ): Observable<Page<CaseRequest>> => {
    const hasDate = start !== '' && end !== '';
    const hasSearch = search.trim() !== '';

    if (hasDate && hasSearch) {
      return this.requestService.getRequestsBySearchAndDate(search, start, end, page, size, "APPROVED");
    } else if (hasDate) {
      return this.requestService.getRequestsByDateRange(start, end, page, size, "APPROVED");
    } else if (hasSearch) {
      return this.requestService.getRequestsBySearch(search, page, size, "APPROVED");
    } else {
      return this.requestService.getRequestsByStatus(page, size, "APPROVED");
    }
  };

  // openModalRegister() {
  //   this.modalService.openModalForCreation(this.entity);
  // }
}
