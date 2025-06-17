import { Component, inject } from '@angular/core';
import { DataTableComponent } from "../../../shared/components-admin/data-table/data-table.component";
import { DataTableColumn } from '../../../core/models/datatable-column.model';
import { ModalEntityType } from '../../../core/models/modal-entity-type';
import { ModalService } from '../../../core/services-admin/modal/modal.service';
import { REQUEST_SERVICE_TOKEN } from '../../../core/models/token-injection.model';
import { Observable } from 'rxjs';
import { CaseRequest } from '../../../core/models/case-request.model';
import { Page } from '../../../core/models/pageable.model';
import { EntityFilterComponent } from '../../../shared/components-admin/entity-filter/entity-filter.component';
import { ModalRequestViewComponent } from '../modal-request-view/modal-request-view.component';

@Component({
  selector: 'app-pending-request',
  standalone: true,
  imports: [EntityFilterComponent, ModalRequestViewComponent],
  templateUrl: './pending-request.component.html',
  styleUrl: './pending-request.component.css'
})
export class PendingRequestComponent {

  entity: ModalEntityType = 'request-pending';

  modalService = inject(ModalService);
  requestService = inject(REQUEST_SERVICE_TOKEN);

  columns: DataTableColumn[] = [
    { label: 'Codigo', dataKey: 'code' },
    { label: 'Título del Caso', dataKey: 'title' },
    { label: 'Descripcion', dataKey: 'description' },
    { label: 'Tipo de Caso', dataKey: 'type_case' },
    { label: 'Cliente', dataKey: 'customer' },
    { label: 'Fecha de Creacion', dataKey: 'creation' },
    { label: 'Estado del Caso', dataKey: 'status_request' }
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
      return this.requestService.getRequestsBySearchAndDate(search, start, end, page, size, "PENDING");
    } else if (hasDate) {
      return this.requestService.getRequestsByDateRange(start, end, page, size, "PENDING");
    } else if (hasSearch) {
      return this.requestService.getRequestsBySearch(search, page, size, "PENDING");
    } else {
      return this.requestService.getRequestsByStatus(page, size, "PENDING");
    }
  };
}
