import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ModalEntityType } from '../../models/modal-entity-type';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalData = new BehaviorSubject<{
    mode: 'create' | 'edit' | 'view' | 'task' | 'resolution',
    data: any | null,
    entity: ModalEntityType
  } | null>(null);

  openModalForCreation(entity: ModalEntityType) {
    this.modalData.next({ mode: 'create', data: null, entity });
  }

  openModalWithData(data: any, entity: ModalEntityType) {
    this.modalData.next({ mode: 'edit', data, entity });
  }

  openModalView(data: any, entity: ModalEntityType) {
    this.modalData.next({ mode: 'view', data, entity });
  }

  openModalTask(data: any, entity: ModalEntityType) {
    this.modalData.next({ mode: 'task', data, entity });
  }

  openModalResolution(data: any, entity: ModalEntityType) {
    this.modalData.next({ mode: 'resolution', data, entity });
  }

  getModalData(): Observable<{
    mode: 'create' | 'edit' | 'view' | 'task' | 'resolution',
    data: any | null,
    entity: ModalEntityType
  } | null> {
    return this.modalData.asObservable();
  }

  closeModal() {
    this.modalData.next(null);
  }
}
