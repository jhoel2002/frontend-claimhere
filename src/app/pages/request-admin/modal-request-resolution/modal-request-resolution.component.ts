import { Component, inject, Inject, Input, OnInit } from '@angular/core';
import { IRequestService } from '../../../core/services-admin/request/IRequest.service';
import { ModalService } from '../../../core/services-admin/modal/modal.service';
import { Subscription } from 'rxjs';
import { NgIf } from '@angular/common';
import { CaseRequest } from '../../../core/models/case-request.model';
import { AUTH_SERVICE_TOKEN, DOCUMENT_SERVICE_TOKEN } from '../../../core/models/token-injection.model';
import { document } from '../../../core/models/document.model';
import { AlertService } from '../../../core/services-admin/alert/alert.service';
import { FileCardComponent } from '../../../shared/components-admin/file-card/file-card.component';

@Component({
  selector: 'app-modal-request-resolution',
  standalone: true,
  imports: [NgIf, FileCardComponent],
  templateUrl: './modal-request-resolution.component.html',
  styleUrls: ['./modal-request-resolution.component.css']
})
export class ModalRequestResolutionComponent {

  modalPayload: { mode: 'create' | 'edit' | 'view' | 'task' | 'resolution', data: any | null} | null = null;

  @Input() requestService!: IRequestService;
  @Input() modalService!: ModalService;
  
  alertService = inject(AlertService);
  authService = inject(AUTH_SERVICE_TOKEN);

  uploadError: string = '';

  isopenModal: boolean = false;

  request!: CaseRequest;

  fileResolution!: document;

  subscription = new Subscription();

  ngOnInit() {
    const sub = this.modalService.getModalData().subscribe(payload => {
      if (payload && payload.mode === 'resolution') {
        this.modalPayload = payload;
        this.request = payload.data;
        this.isopenModal = true;
      }
    });
    this.subscription.add(sub);
  }

  ngOnDestroy():void {
    this.subscription.unsubscribe();
  }

  isOpen(): boolean {
    return this.isopenModal;
  }

  close() {
    this.modalService.closeModal();
    this.isopenModal = false;
  }

  hasEnoughTasks(): boolean {
    return this.request?.lenghtTask! >= 5;
  }

  submitResolutionFile() {
    if (!this.fileResolution) {
      this.alertService.error({
        message: 'Debe subir un archivo de resolución en formato PDF.',
      });
      return;
    }

    if(this.uploadError !== ''){
      this.alertService.error({
          message: this.uploadError!,
        });
      return;
    }

    this.alertService.confirmAction({
      confirmText: 'Subir resolución',
    }).then(result => {
      if (!result.isConfirmed) return;

      this.requestService.registerResolution(this.request.code, this.fileResolution).subscribe({
        next: () => {
          this.alertService.success({
            title: 'Resolución enviada',
            message: 'El archivo fue enviado correctamente. El coordinador lo revisará.',
          }).then(() => {
            this.close();
            this.uploadError = '';
          });
        },
        error: () => {
          this.alertService.error({
            message: 'Error al subir la resolución. Intente nuevamente.',
          });
        }
      });
    });
  }

  updateResolutionStatus(status: 'CLOSED' | 'ARCHIVED') {
    const statusMap = {
      CLOSED: {
        title: 'El caso ha sido cerrado exitosamente',
        message: 'Se ha registrado la resolución y el caso está oficialmente cerrado.',
      },
      ARCHIVED: {
        title: 'El caso ha sido archivado exitosamente',
        message: 'Se ha registrado la resolución y el caso ha sido archivado.',
      },
    };

    const selected = statusMap[status];

    // Confirmación
    this.alertService.confirmAction({
      confirmText: status === 'CLOSED' ? 'Cerrar caso' : 'Archivar caso',
    }).then((result) => {
      if (!result.isConfirmed) return;

      // Llamada al servicio
      this.requestService.updateStatus(this.request.code, status).subscribe({
        next: () => {
          this.alertService.success({
            title: selected.title,
            message: selected.message,
          }).then(() => {
            this.close();
          });
        },
        error: (error: any) => {
          this.alertService.error({
            message: error || 'Error al registrar la resolución. Intente nuevamente.',
          });
        }
      });
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.fileResolution = {
        type_document: 'RESOLUTION',
        document: file
      }
      this.uploadError = '';
    } else {
      this.uploadError = 'El archivo debe ser un PDF.';
    }
  }

}
