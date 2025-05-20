import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, inject, Input, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataTableColumn } from '../../../core/models/datatable-column.model';
import { RequestService } from '../../../core/services-admin/request/request.service';
import { ModalService } from '../../../core/services-admin/modal/modal.service';
import { DropdownActionTableComponent } from "../dropdown-action-table/dropdown-action-table.component";

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, DropdownActionTableComponent],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css'
})
export class DataTableComponent {

  caseService = inject(RequestService);
  modalService = inject(ModalService);

  @Input() isRequest = false;
  @Input() columns: DataTableColumn[] = [];
  @Input() data: any[] = [];

  @Input() estadoPendiente: boolean = false;
  @Input() estadoAceptado: boolean = false;
  @Input() isEmpleados: boolean = false;

  @Output() dataUpdated = new EventEmitter<any>();

  @Output() itemDelete = new EventEmitter<any>();

  viewRequest(caseId: any) {
    this.caseService.setCurrentRequestId(caseId);
  }

  editItem(item: any) {
    this.modalService.openModalWithData(item);
  }

  deleteItem(item: any){
    this.itemDelete.emit(item);
  }
}
