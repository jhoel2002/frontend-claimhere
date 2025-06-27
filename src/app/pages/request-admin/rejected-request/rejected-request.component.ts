import { Component, inject } from '@angular/core';
import { DataTableColumn } from '../../../core/models/datatable-column.model';
import { DataTableComponent } from '../../../shared/components-admin/data-table/data-table.component';
import { Observable } from 'rxjs';
import { CaseRequest } from '../../../core/models/case-request.model';
import { Page } from '../../../core/models/pageable.model';
import { ModalEntityType } from '../../../core/models/modal-entity-type';
import { ModalService } from '../../../core/services-admin/modal/modal.service';
import { REQUEST_SERVICE_TOKEN } from '../../../core/models/token-injection.model';
import { EntityFilterComponent } from '../../../shared/components-admin/entity-filter/entity-filter.component';
import { ModalRequestViewComponent } from '../modal-request-view/modal-request-view.component';

@Component({
  selector: 'app-rejected-request',
  standalone: true,
  imports: [EntityFilterComponent, ModalRequestViewComponent],
  templateUrl: './rejected-request.component.html',
  styleUrl: './rejected-request.component.css'
})
export class RejectedRequestComponent {

  entity: ModalEntityType = 'request-rejected';

  modalService = inject(ModalService);
  requestService = inject(REQUEST_SERVICE_TOKEN);
  isRequestRejected:boolean = true;

  columns: DataTableColumn[] = [
    { label: 'Codigo', dataKey: 'code' },
    { label: 'Título del Caso', dataKey: 'title' },
    { label: 'Tipo de Caso', dataKey: 'type_case' },
    { label: 'Cliente', dataKey: 'customerName' },
    { label: 'Fecha de Creacion', dataKey: 'creation' }
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
      return this.requestService.getRequestsBySearchAndDate(search, start, end, page, size, "REJECTED");
    } else if (hasDate) {
      return this.requestService.getRequestsByDateRange(start, end, page, size, "REJECTED");
    } else if (hasSearch) {
      return this.requestService.getRequestsBySearch(search, page, size, "REJECTED");
    } else {
      return this.requestService.getRequestsByStatus(page, size, "REJECTED");
    }
  };
}
