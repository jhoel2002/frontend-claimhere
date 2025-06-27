import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalService } from '../../../core/services-admin/modal/modal.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { IRequestService } from '../../../core/services-admin/request/IRequest.service';
import { Subscription} from 'rxjs';
import { DropdownCustomerComponent } from '../../../shared/components-admin/dropdown-customer/dropdown-customer.component';
import { document } from '../../../core/models/document.model';
import { AUTH_SERVICE_TOKEN, BUFFET_SERVICE_TOKEN, CUSTOMER_SERVICE_TOKEN, LAWYER_SERVICE_TOKEN } from '../../../core/models/token-injection.model';
import { AlertService } from '../../../core/services-admin/alert/alert.service';

@Component({
  selector: 'app-modal-request-form',
  standalone: true,
  imports: [NgIf, NgFor, ReactiveFormsModule, FormsModule, CommonModule, DropdownCustomerComponent],
  templateUrl: './modal-request-form.component.html',
  styleUrls: ['./modal-request-form.component.css']
})
export class ModalRequestFormComponent implements OnInit {

  @Output() valueForm = new EventEmitter();

  modalPayload: { mode: 'create' | 'edit' | 'view' | 'task' | 'resolution', data: any | null} | null = null;

  caseTypes: string[] = [];

  caseTypeSelected: string = ''

  subscription = new Subscription();

  customerService = inject(CUSTOMER_SERVICE_TOKEN);
  lawyerService = inject(LAWYER_SERVICE_TOKEN);
  buffetService = inject(BUFFET_SERVICE_TOKEN);
  authService = inject(AUTH_SERVICE_TOKEN)

  @Input() requestService!: IRequestService;
  @Input() modalService!: ModalService;

  alertService = inject(AlertService);
  fb = inject(FormBuilder);
  
  uploadError: string | null = null;

  form!: FormGroup;

  isopenModal:boolean = false;

  ngOnInit() {
    this.createForm();
    const sub = this.modalService.getModalData().subscribe(payload => {
      if (payload && payload.mode === 'create') {
        this.modalPayload = payload;
        this.isopenModal = true;
      }
    });
    this.subscription.add(sub);
    const sub2 = this.buffetService.getTypeCasesByCode(this.authService.userBuffet).subscribe({
      next: (types: string[]) => {
        this.caseTypes = types;
      }
    });
    this.subscription.add(sub2);
    const sub3 = this.type_case!.valueChanges
    .subscribe(selected => {
      const lawyerCtrl = this.lawyer!;
      if (selected) {
        lawyerCtrl.enable();
      } else {
        lawyerCtrl.reset();
        lawyerCtrl.disable();
      }
    });
    this.subscription.add(sub3);
  }

  createForm():void {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      type_case: ['', Validators.required],
      customer: ['', Validators.required],
      lawyer: [{ value: '', disabled: true }, Validators.required],
      evidences: [null],
      cotizacion: [null],
    });
  }

  ngOnDestroy():void {
    this.subscription.unsubscribe();
  }

  resetFormState(): void {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  close() {
    this.resetFormState();
    this.modalService.closeModal();
    this.isopenModal = false;
  }

  isOpen(): boolean {
    return this.isopenModal;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = { ...this.form.value };
    const codeCustomer: string = payload.customer;
    const codeLawyer: string = payload.lawyer;
    const evidences: File[] = payload.evidences;
    const cotization: File = payload.cotization;
    this.requestService.register(codeCustomer, codeLawyer, payload, evidences, cotization).subscribe({
      next: () => {
        this.alertService.success({ message: "Caso creado exitosamente" }).then(() => {
          this.valueForm.emit();
          this.close();
        });
      },
      error: (error: any) => {
        this.alertService.error({ message: error });
      }
    });
  }

  onEvidencesSelected(event: any): void {
    const evidences:File []= Array.from(event.target.files);
    if (!evidences) return; 
    this.form.patchValue(
      { 
        evidences: evidences
      }
    );
    this.uploadError = null;
  }
  
  onCotizationSelected(event: any): void {
    const cotization: File = event.target.files[0];
    if (!cotization) return;
    this.form.patchValue(
      { 
        cotization: cotization
      }
    );
    this.uploadError = null;
  }

  get title() { 
    return this.form.get('title'); 
  }

  get description() { 
    return this.form.get('description'); 
  }

  get type_case() { 
    return this.form.get('type_case'); 
  }

  get lawyer(): FormControl { 
    return this.form.get('lawyer') as FormControl; 
  }

  get customer(): FormControl { 
    return this.form.get('customer') as FormControl; 
  }
}
