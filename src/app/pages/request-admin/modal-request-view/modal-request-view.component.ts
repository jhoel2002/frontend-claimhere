import { Component, EventEmitter, inject, Input, input, OnInit, Output } from '@angular/core';
import { IRequestService } from '../../../core/services-admin/request/IRequest.service';
import { AlertService } from '../../../core/services-admin/alert/alert.service';
import { ModalService } from '../../../core/services-admin/modal/modal.service';
import { Subscription } from 'rxjs';
import { CaseRequest } from '../../../core/models/case-request.model';
import { NgClass, NgForOf, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
// import { CaseRequestFull, Document } from '../../../core/models/case-request-full.model';
import { DropdownCustomerComponent } from '../../../shared/components-admin/dropdown-customer/dropdown-customer.component';
import { FormControl, Validators } from '@angular/forms';
import { AUTH_SERVICE_TOKEN, DOCUMENT_SERVICE_TOKEN, LAWYER_SERVICE_TOKEN } from '../../../core/models/token-injection.model';
import { FileCardComponent } from '../../../shared/components-admin/file-card/file-card.component';
import { ModalEntityType } from '../../../core/models/modal-entity-type';
import { document } from '../../../core/models/document.model';

@Component({
  selector: 'app-modal-request-view',
  standalone: true,
  imports: [NgIf, NgForOf, NgClass, NgSwitchCase, NgSwitch, DropdownCustomerComponent, FileCardComponent],
  templateUrl: './modal-request-view.component.html',
  styleUrls: ['./modal-request-view.component.css']
})
export class ModalRequestViewComponent implements OnInit {

  @Input() requestService!: IRequestService;
  @Input() entity!: ModalEntityType;

  @Output() dataUpdated = new EventEmitter();

  lawyerService = inject(LAWYER_SERVICE_TOKEN);
  private alertService = inject(AlertService);
  private modalService = inject(ModalService);
  private documentService = inject(DOCUMENT_SERVICE_TOKEN)

  private subscription = new Subscription();

  isOpenModal: boolean = false;

  uploadError: string | null = null;

  modalPayload: { mode: 'create' | 'edit' | 'view' | 'task' | 'resolution', data: string | null} | null = null;

  request: Partial<CaseRequest> | null = null;

  cotization!: document;

  lawyer = new FormControl('', Validators.required);

  ngOnInit() {
    const sub = this.modalService.getModalData().subscribe(payload => {
      if (payload && payload.mode === 'view') {
        this.modalPayload = payload;
        this.request = payload.data;
        this.isOpenModal = true;
        this.loadRequestData(payload.data.code);
      }
    });
    this.subscription.add(sub);
  }

  loadRequestData(code: string): void {
    const sub = this.requestService.getRequestView(code).subscribe({
      next: (data: Partial<CaseRequest>) => {
        this.request = { ...this.request, ...data };
      },
      error: (error: any) => {
        this.alertService.error({message:'Error al cargar los datos del caso.'});
      }
    });
    this.subscription.add(sub);
  }

  resetControlState(): void {
    this.lawyer.reset();
    this.lawyer.setErrors(null); 
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  close() {
    this.modalService.closeModal();
    this.resetControlState();
    this.isOpenModal = false;
  }

  isOpen(): boolean {
    return this.isOpenModal;
  }

  isStep0Active(): boolean {
    const status = this.request?.status_request?.toUpperCase() ?? '';
    return ['RECEIVED', 'VALIDATED', 'ASSIGNED', 'QUOTED', 'QUOTED_APPROVED'].includes(status);
  }

  isStep1Active(): boolean {
    const status = this.request?.status_request?.toUpperCase() ?? '';
    return ['VALIDATED', 'ASSIGNED', 'QUOTED', 'QUOTED_APPROVED'].includes(status);
  }

  isStep2Active(): boolean {
    const status = this.request?.status_request?.toUpperCase() ?? '';
    return ['ASSIGNED', 'QUOTED', 'QUOTED_APPROVED'].includes(status);
  }

  isStep3Active(): boolean {
    const status = this.request?.status_request?.toUpperCase() ?? '';
    return ['QUOTED', 'QUOTED_APPROVED'].includes(status);
  }

  isStep4Active(): boolean {
    const status = this.request?.status_request?.toUpperCase() ?? '';
    return status === 'QUOTED_APPROVED';
  }

  udpateStatus(text: string) {
    const statusMap: {[key: string]: { status: string; title: string; message: string };} = {
      Recibir: {
        status: 'RECEIVED',
        title: 'La solicitud del caso ha sido recibida',
        message: 'El caso ha sido registrado correctamente y está pendiente de validación.',
      },
      Rechazar: {
        status: 'REJECTED',
        title: 'La solicitud del caso ha sido rechazada',
        message: 'Se ha enviado un correo de notificación al cliente para informarle sobre esta decisión.',
      },
      Validar: {
        status: 'VALIDATED',
        title: 'La solicitud del caso ha sido validada',
        message: 'Se ha enviado un correo de notificación al cliente para informarle acerca de los detalles.',
      },
      Cotizar: {
        status: 'QUOTED',
        title: 'Se ha iniciado el proceso de cotización',
        message: 'El coordinador procederá con la cotización.',
      },
      Asignar: {
        status: 'ASSIGNED',
        title: 'Se ha asignado un abogado al caso',
        message: 'El abogado fue notificado y empezará a trabajar en el caso.',
      },
      Aprobar: {
        status: 'APPROVED',
        title: 'La solicitud del caso ha sido aceptada exitosamente',
        message: 'Se ha enviado un correo de notificación al cliente.',
      },
    };

    const action = statusMap[text];

    if (text === 'Cotizar') {
      if (!this.cotization) {
        this.uploadError = 'Debe subir un archivo de cotización antes de guardar.';
        return;
      }
      this.uploadError = null;
    }

    if (text === 'Asignar') {
      if (this.lawyer.invalid) {
        this.lawyer.markAsTouched();
        return;
      }
    }

    this.alertService.confirmAction({ confirmText: text }).then((result) => {
      if (!result.isConfirmed) return;

      let request$: any;

      if (text === 'Cotizar') {
        request$ = this.requestService.updateStatusWithCotization(
          this.request?.code!,
          this.cotization
        );
      } else if (text === 'Asignar') {
        request$ = this.requestService.updateStatusWithLawyer(
          this.request?.code!,
          this.lawyer.value
        );
      } else {
        request$ = this.requestService.updateStatus(
          this.request?.code!,
          action.status
        );
      }

      request$.subscribe({
        next: (response: any) => {
          this.alertService
            .success({
              title: action.title,
              message: action.message,
            })
            .then(() => {
              if(text === 'Validar') this.request!.status_request = "VALIDATED";
              if(text === 'Cotizar') {
                this.request!.status_request = "QUOTED";
                const documentMap: any = response.documentMap?.[0]
                this.request!.cotization = documentMap ;
              }
              if(text === 'Asignar') {
                this.request!.lawyerName = response.lawyer;
                this.request!.status_request = "ASSIGNED"};
              if(text === 'Aprobar') this.close();

              this.dataUpdated.emit();
            });
        },
        error: (error: any) => {
          this.alertService.error({
            message: error,
          });
        },
      });
    });
  }

  getStatusClass(): string {
    const baseClasses = "px-2 py-1 rounded-full text-sm font-medium";
    const status = this.request?.status_request?.toLowerCase();

    switch (status) {
      case "received":
      case "quoted":
      case "assigned":
      case "validated":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case "quoted_approved":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "rejected":
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (!file) return;
    this.cotization = {
      type_document: 'QUOTATION',
      document: file
    }
    this.uploadError = null;
  }

  downloadFileByCode(cotizacion: any) {
    this.documentService.downloadFileByCode(cotizacion.code).subscribe({
      next: (doc) => {
        if (!doc) {
          this.alertService.error({ message: 'El archivo no fue encontrado.' });
          return;
        }
        const url = URL.createObjectURL(doc);
        const a = document.createElement('a');
        a.href = url;
        a.download = cotizacion.name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      },
      error: (error) => {
        this.alertService.error({ message: error });
      },
    });
  }
}
