import { Component, EventEmitter, inject, Input, input, OnInit, Output } from '@angular/core';
import { IRequestService } from '../../../core/services-admin/request/IRequest.service';
import { AlertService } from '../../../core/services-admin/alert/alert.service';
import { ModalService } from '../../../core/services-admin/modal/modal.service';
import { Subscription } from 'rxjs';
import { CaseRequest } from '../../../core/models/case-request.model';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { CaseRequestFull } from '../../../core/models/case-request-full.model';

@Component({
  selector: 'app-modal-request-view',
  standalone: true,
  imports: [NgIf, NgForOf, NgClass],
  templateUrl: './modal-request-view.component.html',
  styleUrls: ['./modal-request-view.component.css']
})
export class ModalRequestViewComponent implements OnInit {

  @Input() requestService!: IRequestService;

  private alertService = inject(AlertService);
  private modalService = inject(ModalService);

  private subscription = new Subscription();

  modalPayload: { mode: 'create' | 'edit' | 'view', data: any | null} | null = null;

  idCase!: string;

  requestFull: CaseRequestFull | null = null;

  ngOnInit() {
    const sub = this.modalService.getModalData().subscribe(payload => {
      this.modalPayload = payload;
      console.log(payload?.data);
      if (payload) {
        this.loadRequestData(payload.data);
      }
    });
    this.subscription.add(sub);
  }

  loadRequestData(id: string): void {
    const sub = this.requestService.getRequestById(id).subscribe({
      next: (data: any) => {
        console.log(data);
        this.requestFull = data;
      },
      error: (error: any) => {
        this.alertService.error({message:'Error al cargar los datos del request.'});
        console.error(error);
      }
    });
    this.subscription.add(sub);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  close() {
    this.requestFull = {} as CaseRequestFull;
    this.modalService.closeModal();
  }

  isOpen(): boolean {
    return this.modalPayload !== null;
  }

  @Output() modalClose = new EventEmitter<void>();

  selectedImage: string | null = null;

  handleEscKey = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      this.close();
    }
  }

  getStatusClass(): string {
    const baseClasses = "px-2 py-1 rounded-full text-sm font-medium";
    switch(this.requestFull?.status_request?.toLowerCase()) {
      case "pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case "approved":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "rejected":
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  }

  openLightbox(image: string): void {
    this.selectedImage = image;
  }

  closeLightbox(): void {
    this.selectedImage = null;
  }

  // Added: New method for handling downloads
  downloadEvidence(evidence: any): void {
    const link = document.createElement("a");
    link.href = evidence.fileUrl;
    link.download = evidence.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

}
