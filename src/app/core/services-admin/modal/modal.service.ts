import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private editData = new BehaviorSubject<any | null>(null);

  constructor() {}

  openModalWithData(data: any) {
    this.editData.next(data);
  }

  getModalData(): Observable<any> {
    return this.editData.asObservable();
  }

  closeModal() {
    this.editData.next(null);
  }
}
