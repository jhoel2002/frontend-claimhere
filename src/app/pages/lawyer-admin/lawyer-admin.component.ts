import { Component, inject, OnInit } from '@angular/core';
import { ModalEntityType } from '../../core/models/modal-entity-type';
import { ModalService } from '../../core/services-admin/modal/modal.service';
import { LAWYER_SERVICE_TOKEN } from '../../core/models/token-injection.model';
import { DataTableColumn } from '../../core/models/datatable-column.model';
import { Observable } from 'rxjs';
import { Lawyer } from '../../core/models/lawyer.model';
import { Page } from '../../core/models/pageable.model';
import { EntityFilterComponent } from '../../shared/components-admin/entity-filter/entity-filter.component';
import { ModalLawyerFormComponent } from './modal-lawyer-form/modal-lawyer-form.component';

@Component({
  selector: 'app-lawyer-admin',
  standalone: true,
  imports: [EntityFilterComponent, ModalLawyerFormComponent],
  templateUrl: './lawyer-admin.component.html',
  styleUrls: ['./lawyer-admin.component.css']
})
export class LawyerAdminComponent {

  entity: ModalEntityType = 'lawyer';

  modalService = inject(ModalService);
  lawyerService = inject(LAWYER_SERVICE_TOKEN);

  columns: DataTableColumn[] = [
    { label: 'Codigo', dataKey: 'code' },
    { label: 'Nombres y Apellidos', dataKey: 'fullName' },
    { label: 'Especialidad de casos', dataKey: 'case_type' },
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
  ): Observable<Page<Lawyer>> => {
    const hasDate = start !== '' && end !== '';
    const hasSearch = search.trim() !== '';

    if (hasDate && hasSearch) {
      return this.lawyerService.getLawyersBySearchAndDate(search, start, end, page, size);
    } else if (hasDate) {
      return this.lawyerService.getLawyersByDateRange(start, end, page, size);
    } else if (hasSearch) {
      return this.lawyerService.getLawyersBysearch(search, page, size);
    } else {
      return this.lawyerService.getAll(page, size);
    }
  };

  openModalRegister() {
    this.modalService.openModalForCreation(this.entity);
  }
}
