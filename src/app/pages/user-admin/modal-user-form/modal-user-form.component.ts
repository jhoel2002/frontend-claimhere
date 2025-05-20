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

    tipoDocumentoSeleccionado: string = '';
    score: number = 0;
  
    constructor(
      private fb: FormBuilder,
      private userService: UserService,
      private alertService: AlertService,
      private modalService: ModalService,
      private cdr: ChangeDetectorRef
    ) {
      this.createForm();
    }

  private createForm() {
    this.form = this.fb.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      tipoDocIdentidad: ['', [Validators.required]],
      docIdentidad: [
        '',
        [
          Validators.required,
          CustomValidations.invalidDocument(this.tipoDocumentoSeleccionado),
        ],
      ],
      correoUsuario: ['', [Validators.required, Validators.email]],
      passwordUsuario: ['', 
        [
          Validators.required,
          // this.validarFortalezaPassword.bind(this)
        ]
      ],
      confirmacionPassword: ['', [Validators.required, this.confirmPasswordValidator.bind(this)]],
      rol: ['', Validators.required]
    });

    this.tipoDocIdentidad?.valueChanges.subscribe((tipo) => {
      this.tipoDocumentoSeleccionado = tipo;
      this.updateDocIdentidadValidation();
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
    const password = this.form?.get('passwordUsuario')?.value;
    const confirmPassword = control.value;
  
    return password === confirmPassword ? null : { 'passwordMismatch': true };
  }

  updateDocIdentidadValidation() {
    if (this.docIdentidad) {
      this.docIdentidad.setValidators([
        Validators.required,
        CustomValidations.invalidDocument(this.tipoDocumentoSeleccionado),
      ]);
      this.docIdentidad.updateValueAndValidity();
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const formData = this.form.value;
    this.userService.register(formData).subscribe({
      next: () => {
        this.alertService.success({
          message: 'Usuario Registrado Correctamente.',
        }).then(() => {
          this.form.reset();
          this.valueForm.emit();
          //$(this.modal?.nativeElement).modal('hide'); // Cerrar el modal usando jQuery
        });
      },
      error: (error) => {
        this.alertService.error({
          message: error,
        });
      },
    });
  }

  modalData: any;

  ngOnInit(): void {
    this.modalService.getModalData().subscribe(data => {
      this.modalData = data;
    });
  }

  close() {
    this.modalService.closeModal();
  }

  isOpen(): boolean {
    return this.modalData !== null;
  }

  get nombres() {
    return this.form.get('nombres');
  }

  get apellidos() {
    return this.form.get('apellidos');
  }

  get tipoDocIdentidad() {
    return this.form.get('tipoDocIdentidad');
  }

  get docIdentidad() {
    return this.form.get('docIdentidad');
  }

  get passwordUsuario(){
    return this.form.get('passwordUsuario');
  }

  get confirmacionPassword(){
    return this.form.get('confirmacionPassword');
  }

  get correoUsuario() {
    return this.form.get('correoUsuario');
  }

  get rol() {
    return this.form.get('rol');
  }

}
