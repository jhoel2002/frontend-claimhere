import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalData = new BehaviorSubject<{ mode: 'create' | 'edit', data: any | null } | null>(null);

  openModalWithData(data: any) {
    this.modalData.next({ mode: 'edit', data });
  }

  openModalForCreation() {
    this.modalData.next({ mode: 'create', data: null });
  }

  getModalData(): Observable<{ mode: 'create' | 'edit', data: any | null } | null> {
    return this.modalData.asObservable();
  }

  closeModal() {
    this.modalData.next(null);
  }
}
