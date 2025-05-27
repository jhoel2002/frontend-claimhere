import { ChangeDetectorRef, Component, ElementRef, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../core/services-admin/user/user.service';
import { AlertService } from '../../../core/services-admin/alert/alert.service';
import { CustomValidations } from '../../../core/utils/validators';
import { NgIf } from '@angular/common';
import { ModalService } from '../../../core/services-admin/modal/modal.service';
import { Subscription } from 'rxjs';
import { User } from '../../../core/models/user.model';
import { IUserService } from '../../../core/services-admin/user/IUserService';
import { ICustomerService } from '../../../core/services-admin/customer/ICustomerService';
import { Customer } from '../../../core/models/customer.model';
import { ModalEntityType } from '../../../core/models/modal-entity-type';

@Component({
  selector: 'app-modal-customer-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './modal-customer-form.component.html',
  styleUrls: ['./modal-customer-form.component.css']
})
export class ModalCustomerFormComponent implements OnInit {

  form!: FormGroup;
  @Output() valueForm = new EventEmitter();

  @Input() customerService!: ICustomerService;

  isEditMode = false;

  private originalData: any;
  private typeDocumentSelection: string = '';

  // score: number = 0;

  private subscription = new Subscription();

  modalPayload: { mode: 'create' | 'edit' | 'view', data: Customer | null} | null = null;

  private fb = inject(FormBuilder);
  private alertService = inject(AlertService);
  private modalService = inject(ModalService);

  ngOnInit(): void {
    this.createForm();
    const sub = this.modalService.getModalData().subscribe(payload => {
      this.modalPayload = payload;
      if (payload) {
        this.isEditMode = payload.mode === 'edit';
        this.isEditMode ? this.setupEditMode(payload.data) : this.setupCreateMode();
      }
    });
    this.subscription.add(sub);
    const sub2 =  this.type_document?.valueChanges.subscribe((tipo) => {
      this.typeDocumentSelection = tipo;
      this.updateDocIdentidadValidation();
    });
    this.subscription.add(sub2);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private setValidatorsForPasswordFields(required: boolean): void {
    if (required) {
      this.password?.setValidators([Validators.required]);
      this.confirmationPassword?.setValidators([Validators.required, this.confirmPasswordValidator.bind(this)]);
    } else {
      this.password?.clearValidators();
      this.confirmationPassword?.clearValidators();
    }
    this.password?.updateValueAndValidity();
    this.confirmationPassword?.updateValueAndValidity();
  }

  changeValidations() {
    const sub = this.showChangePassword?.valueChanges.subscribe(checked => {
      if (!checked) {
        this.password?.reset();
        this.confirmationPassword?.reset();
      }
      this.setValidatorsForPasswordFields(checked);
    });
    if (sub) this.subscription.add(sub);
  }

  fillForm(data: Partial<User>) {
    this.form.patchValue({
      name: data.name,
      lastname: data.lastname,
      address: data.address,
      phone: data.phone,
      email: data.email,
    });
  }

  private setupEditMode(data: User): void {
    this.fillForm(data);
    this.changeValidations();

    this.originalData = {
      ...this.form.getRawValue(),
      showChangePassword: false,
      password: '',
      confirmationPassword: ''
    };
  }

  private resetFormState(): void {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  private setupCreateMode(): void {
    this.resetFormState();
    this.setValidatorsForPasswordFields(true);
  }

  close() {
    this.setValidatorsForPasswordFields(false);
    this.resetFormState();
    this.modalService.closeModal();
  }

  isOpen(): boolean {
    return this.modalPayload !== null;
  }

  private createForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      type_document: ['', [Validators.required]],
      document: [
        '',
        [
          Validators.required,
          CustomValidations.invalidDocument(this.typeDocumentSelection),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      password: ['', 
        [
          // Validators.required,
          // this.validarFortalezaPassword.bind(this)
        ]
      ],
      confirmationPassword: ['',[]],
      showChangePassword: [false]
    });
  }

  // onStrengthChange(score: number){
  //   this.score = score;
  //   this.form.get('passwordUsuario')?.updateValueAndValidity();
  //   this.cdr.detectChanges();
  // }

  // validarFortalezaPassword(): { [key: string]: boolean } | null {
  //   return this.score === 100 ? null : { 'passwordStrength': true };
  // }

  confirmPasswordValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = this.password?.value;
    const confirmPassword = control.value;
  
    return password === confirmPassword ? null : { 'passwordMismatch': true };
  }

  updateDocIdentidadValidation() {
    if (this.document) {
      this.document.setValidators([
        Validators.required,
        CustomValidations.invalidDocument(this.typeDocumentSelection),
      ]);
      this.document.updateValueAndValidity();
    }
  }

  private isFormChanged(): boolean {
    const v = this.form.getRawValue();
    const o = this.originalData;

    return ['name', 'last_name', 'address', 'phone', 'email', 'type_document', 'document'].some(f => v[f] !== o[f])
      || (v.showChangePassword && (v.password.trim() !== '' || v.confirmationPassword.trim() !== ''));
  }
 
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.isEditMode && !this.isFormChanged()) {
      this.alertService.info({ message: 'No se han realizado cambios.' });
      return;
    }

    const formData = this.form.getRawValue();

    const request$ = this.modalPayload?.mode === 'edit' && this.modalPayload.data
      ? this.customerService.update(this.modalPayload.data.id, formData)
      : this.customerService.register(formData);

    request$.subscribe({
      next: () => {
        const successMessage = this.isEditMode
          ? 'Cliente actualizado correctamente.'
          : 'Cliente registrado correctamente.';

        this.alertService.success({ message: successMessage }).then(() => {
          this.valueForm.emit();
          this.close();
        });
      },
      error: (error: any) => {
        this.alertService.error({ message: error });
      }
    });
  }

  get showChangePassword(){
    return this.form.get('showChangePassword');
  }

  get name() {
    return this.form.get('name');
  }

  get lastname() {
    return this.form.get('lastname');
  }

  get email() {
    return this.form.get('email');
  }

  get address() {
    return this.form.get('address');
  }

  get phone() {
    return this.form.get('phone');
  }

  get type_document() {
    return this.form.get('type_document');
  }

  get document() {
    return this.form.get('document');
  }

  get password(){
    return this.form.get('password');
  }

  get confirmationPassword(){
    return this.form.get('confirmationPassword');
  }

}
