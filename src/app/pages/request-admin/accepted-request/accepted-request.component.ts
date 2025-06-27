import { Component, inject } from '@angular/core';
import { DataTableColumn } from '../../../core/models/datatable-column.model';
import { Observable } from 'rxjs';
import { Page } from '../../../core/models/pageable.model';
import { ModalService } from '../../../core/services-admin/modal/modal.service';
import { AUTH_SERVICE_TOKEN, REQUEST_SERVICE_TOKEN } from '../../../core/models/token-injection.model';
import { CaseRequest } from '../../../core/models/case-request.model';
import { ModalEntityType } from '../../../core/models/modal-entity-type';
import { EntityFilterComponent } from '../../../shared/components-admin/entity-filter/entity-filter.component';
import { ModalRequestViewComponent } from '../modal-request-view/modal-request-view.component';
import { ModalRequestFormComponent } from '../modal-request-form/modal-request-form.component';
import { ModalRequestTaskComponent } from '../modal-request-task/modal-request-task.component';
import { ModalRequestResolutionComponent } from '../modal-request-resolution/modal-request-resolution.component';

@Component({
  selector: 'app-accepted-request',
  standalone: true,
  imports: [EntityFilterComponent, ModalRequestViewComponent, ModalRequestFormComponent, ModalRequestTaskComponent, ModalRequestResolutionComponent],
  templateUrl: './accepted-request.component.html',
  styleUrl: './accepted-request.component.css'
})
export class AcceptedRequestComponent {

  entity: ModalEntityType = 'request-approved';

  modalService = inject(ModalService);
  requestService = inject(REQUEST_SERVICE_TOKEN);
  authService = inject(AUTH_SERVICE_TOKEN);

  isRequestApproved:boolean = true;

  columns: DataTableColumn[] = [
    { label: 'Codigo', dataKey: 'code' },
    { label: 'Título del Caso', dataKey: 'title' },
    { label: 'Tipo de Caso', dataKey: 'type_case' },
    { label: 'Cliente', dataKey: 'customerName' },
    { label: 'Abogado', dataKey: 'lawyerName' },
    { label: 'Cant. Tareas', dataKey: 'lenghtTask' },
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
    const status = 'APPROVED';
    const isLawyer = this.authService.userRole === 'ROLE_LAWYER';
    const lawyerCode = isLawyer ? this.authService.userCode : undefined;

    if (hasDate && hasSearch) {
      return this.requestService.getRequestsBySearchAndDate(search, start, end, page, size, status, lawyerCode);
    } else if (hasDate) {
      return this.requestService.getRequestsByDateRange(start, end, page, size, status, lawyerCode);
    } else if (hasSearch) {
      return this.requestService.getRequestsBySearch(search, page, size, status, lawyerCode);
    } else {
      return this.requestService.getRequestsByStatus(page, size, status, lawyerCode);
    }
  };

  openModalRegister() {
    this.modalService.openModalForCreation(this.entity);
  }
}
