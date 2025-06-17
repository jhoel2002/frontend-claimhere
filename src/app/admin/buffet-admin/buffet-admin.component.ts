import { Component, inject, OnInit } from '@angular/core';
import { DataTableColumn } from '../../core/models/datatable-column.model';
import { Observable } from 'rxjs';
import { ModalEntityType } from '../../core/models/modal-entity-type';
import { ModalService } from '../../core/services-admin/modal/modal.service';
import { BUFFET_SERVICE_TOKEN } from '../../core/models/token-injection.model';
import { Page } from '../../core/models/pageable.model';
import { Buffet } from '../../core/models/buffet.model';
import { EntityFilterComponent } from '../../shared/components-admin/entity-filter/entity-filter.component';
import { ModalBuffetFormComponent } from './modal-buffet-form/modal-buffet-form.component';

@Component({
  selector: 'app-buffet-admin',
  standalone: true,
  imports: [EntityFilterComponent, ModalBuffetFormComponent],
  templateUrl: './buffet-admin.component.html',
  styleUrls: ['./buffet-admin.component.css']
})
export class BuffetAdminComponent {

  entity: ModalEntityType = 'buffet';

  modalService = inject(ModalService);
  buffetService = inject(BUFFET_SERVICE_TOKEN);

  columns: DataTableColumn[] = [
    { label: 'Codigo', dataKey: 'code' },
    { label: 'Nombre', dataKey: 'name' },
    { label: 'Fecha de Creacion', dataKey: 'creation' },
  ];

  loadUsers = (
    search: string,
    start: string,
    end: string,
    page: number,
    size: number
  ): Observable<Page<Buffet>> => {
    const hasDate = start !== '' && end !== '';
    const hasSearch = search.trim() !== '';

    if (hasDate && hasSearch) {
      return this.buffetService.getBuffetsBySearchAndDate(search, start, end, page, size);
    } else if (hasDate) {
      return this.buffetService.getBuffetByDateRange(start, end, page, size);
    } else if (hasSearch) {
      return this.buffetService.getBuffetsBysearch(search, page, size);
    } else {
      return this.buffetService.getAll(page, size);
    }
  };

  openModalRegister() {
    this.modalService.openModalForCreation(this.entity);
  }
}
