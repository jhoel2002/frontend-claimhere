import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Lawyer } from '../../../core/models/lawyer.model';
import { AlertService } from '../../../core/services-admin/alert/alert.service';
import { ModalService } from '../../../core/services-admin/modal/modal.service';
import { CustomValidations } from '../../../core/utils/validators';
import { ILawyerService } from '../../../core/services-admin/lawyer/ILawyer.service';
import { AUTH_SERVICE_TOKEN, BUFFET_SERVICE_TOKEN } from '../../../core/models/token-injection.model';

@Component({
  selector: 'app-modal-lawyer-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgFor],
  templateUrl: './modal-lawyer-form.component.html',
  styleUrls: ['./modal-lawyer-form.component.css']
})
export class ModalLawyerFormComponent{

  form!: FormGroup;
  @Output() valueForm = new EventEmitter();

  @Input() lawyerService!: ILawyerService;

  isEditMode = false;
  caseTypes: string[] = [];

  private originalData: any;

  uploadError: string | null = null;

  // score: number = 0;

  private subscription = new Subscription();

  modalPayload: { mode: 'create' | 'edit' | 'view' | 'task' | 'resolution', data: Lawyer | null} | null = null;

  private fb = inject(FormBuilder);
  private alertService = inject(AlertService);
  private modalService = inject(ModalService);
  buffetService = inject(BUFFET_SERVICE_TOKEN);
  authService = inject(AUTH_SERVICE_TOKEN);

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
    const sub2 = this.buffetService.getTypeCasesByCode(this.authService.userBuffet).subscribe({
      next: (types: string[]) => {
        this.caseTypes = types;
      }
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

  fillForm(data: Partial<Lawyer>) {

    const full = (data.fullName ?? '').trim();
    const parts = full.split(/\s+/);
    const name = parts.shift() ?? '';
    const last_name = parts.join(' ');

    this.form.patchValue({
      name: name,
      last_name: last_name,
      address: data.address,
      phone: data.phone,
      email: data.email,
      case_type: data.case_type
    });
  }

  private setupEditMode(data: Lawyer): void {
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
      last_name: ['', Validators.required],
      description: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', 
        [
          // Validators.required,
          // this.validarFortalezaPassword.bind(this)
        ]
      ],
      case_type: ['', Validators.required],
      foto: [null],
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

  private isFormChanged(): boolean {
    const v = this.form.getRawValue();
    const o = this.originalData;

    return ['name', 'last_name', 'address', 'phone', 'email', 'case_type'].some(f => v[f] !== o[f])
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
      ? this.lawyerService.update(this.modalPayload.data.code!, formData)
      : this.lawyerService.register(formData);

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

  disableItem(item: any) {
    if (!item?.code) return;
    const newStatus = !item.enabled;

    this.lawyerService
      .disabled(item.code, newStatus) // PATCH al endpoint /enable
      .subscribe({
        next: () => {
          this.alertService.success({ message: `Abogado con codigo ${item.code} actualizado correctamente` }).then(() => {
            this.valueForm.emit();
            this.close();
          });
          item.enabled = newStatus; // Refrescamos la fila localmente
        },
        error: (error: any) => {
          this.alertService.error({ message: error });
        },
      });
  }
  
  deleteItem(item: any) {
    if (!item?.code) return;
    this.lawyerService
      .delete(item.code)
      .subscribe({
        next: () => {
          this.alertService.success({ message: `Abogado con codigo ${item.code} eliminado correctamente` }).then(() => {
            this.valueForm.emit();
            this.close();
          });
        },
        error: (error: any) => {
          this.alertService.error({ message: error });
        },
      });
  }

  onFotoSelected(event: any): void {
    const file: File = event.target.files[0];
    if (!file) return;
    this.form.patchValue(
      { 
        foto: file
      }
    );
    this.uploadError = null;
  }

  get showChangePassword(){
    return this.form.get('showChangePassword');
  }

  get name() {
    return this.form.get('name');
  }

  get last_name() {
    return this.form.get('last_name');
  }

  get description() {
    return this.form.get('description');
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

  get case_type() {
    return this.form.get('case_type');
  }

  get password(){
    return this.form.get('password');
  }

  get confirmationPassword(){
    return this.form.get('confirmationPassword');
  }

}
