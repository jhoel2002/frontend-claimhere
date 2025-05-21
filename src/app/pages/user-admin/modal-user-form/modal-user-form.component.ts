import { ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../core/services-admin/user/user.service';
import { AlertService } from '../../../core/services-admin/alert/alert.service';
import { CustomValidations } from '../../../core/utils/validators';
import { NgIf } from '@angular/common';
import { ModalService } from '../../../core/services-admin/modal/modal.service';

@Component({
  selector: 'app-modal-user-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './modal-user-form.component.html',
  styleUrls: ['./modal-user-form.component.css']
})
export class ModalUserFormComponent implements OnInit {

  form!: FormGroup;
  @Output() valueForm = new EventEmitter();

  isEditMode = false;

  // tipoDocumentoSeleccionado: string = '';
  // score: number = 0;

  modalPayload: { mode: 'create' | 'edit', data: any | null } | null = null;
  
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private alertService: AlertService,
    private modalService: ModalService,
    ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.modalService.getModalData().subscribe(payload => {
      this.modalPayload = payload;
      if (payload) {
        this.isEditMode = payload.mode === 'edit';
        if (this.isEditMode) {
          this.fillForm(payload.data);
          this.changeValidations();
        } else {
          this.form.reset();
          this.form.markAsPristine();
          this.form.markAsUntouched();
          this.confirmationPassword?.setValidators([Validators.required, this.confirmPasswordValidator.bind(this)]);
          this.password?.setValidators([Validators.required]);
        }
      }
    });
  }

  changeValidations() {
    // Escuchar checkbox
    this.showChangePassword?.valueChanges.subscribe(checked => {
      if (checked) {
        this.password?.setValidators([Validators.required]);
        this.confirmationPassword?.setValidators([Validators.required, this.confirmPasswordValidator.bind(this)]);
      } else {
        // Limpiar campos, errores y validaciones
        this.password?.reset();
        this.confirmationPassword?.reset();

        this.password?.clearValidators();
        this.confirmationPassword?.clearValidators();
      }
      this.password?.updateValueAndValidity();
      this.confirmationPassword?.updateValueAndValidity();
    });
  }


  fillForm(data: any) {
    this.form.patchValue({
      name: data.name,
      lastname: data.lastname,
      address: data.address,
      phone: data.phone,
      email: data.email,
      role: data.role
    });
  }

  close() {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
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
      // tipoDocIdentidad: ['', [Validators.required]],
      // docIdentidad: [
      //   '',
      //   [
      //     Validators.required,
      //     CustomValidations.invalidDocument(this.tipoDocumentoSeleccionado),
      //   ],
      // ],
      email: ['', [Validators.required, Validators.email]],
      password: ['', 
        [
          Validators.required,
          // this.validarFortalezaPassword.bind(this)
        ]
      ],
      confirmationPassword: ['', [Validators.required, this.confirmPasswordValidator.bind(this)]],
      role: ['', Validators.required],
      showChangePassword: [false]
    });

    // this.tipoDocIdentidad?.valueChanges.subscribe((tipo) => {
    //   this.tipoDocumentoSeleccionado = tipo;
    //   this.updateDocIdentidadValidation();
    // });
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
    const password = this.form?.get('password')?.value;
    const confirmPassword = control.value;
  
    return password === confirmPassword ? null : { 'passwordMismatch': true };
  }

  // updateDocIdentidadValidation() {
  //   if (this.docIdentidad) {
  //     this.docIdentidad.setValidators([
  //       Validators.required,
  //       CustomValidations.invalidDocument(this.tipoDocumentoSeleccionado),
  //     ]);
  //     this.docIdentidad.updateValueAndValidity();
  //   }
  // }

  // onSubmit() {
  //   if (this.form.invalid) {
  //     this.form.markAllAsTouched();
  //     return;
  //   }
  //   const formData = this.form.value;
  //   this.userService.register(formData).subscribe({
  //     next: () => {
  //       this.alertService.success({
  //         message: 'Usuario Registrado Correctamente.',
  //       }).then(() => {
  //         this.valueForm.emit();
  //         this.close();
  //       });
  //     },
  //     error: (error) => {
  //       this.alertService.error({
  //         message: error,
  //       });
  //     },
  //   });
  // }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formData = this.form.value;

    const request$ = this.modalPayload?.mode === 'edit'
      ? this.userService.updateSimulation(this.modalPayload.data.id, formData)
      : this.userService.registerSimulation(formData);

    request$.subscribe({
      next: () => {
        const successMessage = this.modalPayload?.mode === 'edit'
          ? 'Usuario actualizado correctamente.'
          : 'Usuario registrado correctamente.';

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

  // get tipoDocIdentidad() {
  //   return this.form.get('tipoDocIdentidad');
  // }

  // get docIdentidad() {
  //   return this.form.get('docIdentidad');
  // }

  get password(){
    return this.form.get('password');
  }

  get confirmationPassword(){
    return this.form.get('confirmationPassword');
  }

  get role() {
    return this.form.get('role');
  }

}
