import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, inject, Input, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataTableColumn } from '../../../core/models/datatable-column.model';
import { RequestService } from '../../../core/services-admin/request/request.service';
import { ModalService } from '../../../core/services-admin/modal/modal.service';
import { DropdownActionTableComponent } from "../dropdown-action-table/dropdown-action-table.component";
import { ModalEntityType } from '../../../core/models/modal-entity-type';

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

  @Input() columns: DataTableColumn[] = [];
  @Input() data: any[] = [];
  @Input() entity!: ModalEntityType;
  
  @Output() itemDelete = new EventEmitter<any>();
  @Output() itemDisable = new EventEmitter<any>();

  taskRequest(item: any) {
    this.modalService.openModalTask(item, this.entity);
  }

  resolutionRequest(item: any){
    this.modalService.openModalResolution(item, this.entity);
  }

  viewRequest(item: any) {
    this.modalService.openModalView(item, this.entity);
  }

  editItem(item: any) {
    this.modalService.openModalWithData(item, this.entity);
  }

  deleteItem(item: any){
    this.itemDelete.emit(item);
  }

  disableItem(item: any){;
    this.itemDisable.emit(item);
  }
}
