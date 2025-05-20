import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalService } from '../../../core/services-admin/modal/modal.service';
import { UserService } from '../../../core/services-admin/user/user.service';
import { AlertService } from '../../../core/services-admin/alert/alert.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-modal-empleados-form-update',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './modal-empleados-form-update.component.html',
  styleUrls: ['./modal-empleados-form-update.component.css']
})
export class ModalEmpleadosFormUpdateComponent {
  form!: FormGroup;
  idUsuario?: number;
  mostrarInputContrasena= false;

  @ViewChild('updateUsuario') modal?: ElementRef;
  @Output() dataUpdated = new EventEmitter();

  tipoDocumentoSeleccionado: string = '';
  score: number = 0;

  constructor(
    private fb: FormBuilder,
    private modalService: ModalService,
    private userService: UserService,
    private alertService: AlertService,
    private cdr: ChangeDetectorRef
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.modalService.getModalData().subscribe((data) => {
      if (data) {
        this.idUsuario = data.idUsuario;
        this.fillForm(data);
      }
    });
  }

  fillForm(data: any) {
    this.form.patchValue({
      nombres: data.nombres,
      apellidos: data.apellidos,
      correoUsuario: data.correo,
      rol: data.rol,
    });
  }

  toggleFormulario() {
    if (this.passwordUsuario && this.confirmacionPassword) {
      if (this.showForm?.value) {
        this.passwordUsuario.reset();
        this.confirmacionPassword.reset();
        this.passwordUsuario?.setValue('');
        this.passwordUsuario?.setValidators(
          [
          Validators.required,
          this.validarFortalezaPassword.bind(this)
        ]
        );
        this.confirmacionPassword?.setValidators([Validators.required, this.confirmPasswordValidator.bind(this)]);
      } else {
        this.passwordUsuario?.clearValidators();
        this.confirmacionPassword?.clearValidators();
      }
      this.passwordUsuario?.updateValueAndValidity();
      this.confirmacionPassword?.updateValueAndValidity();
    }
  }

  private createForm() {
    this.form = this.fb.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      correoUsuario: ['', [Validators.required, Validators.email]],
      passwordUsuario: [null],
      confirmacionPassword: [null],
      rol: ['', Validators.required],
      showForm: [false],
    }); 
   }

  onStrengthChange(score: number){
    this.score = score;
    this.form.get('passwordUsuario')?.updateValueAndValidity();
    this.cdr.detectChanges();
  }

  validarFortalezaPassword(): { [key: string]: boolean } | null {
    return this.score === 100 ? null : { 'passwordStrength': true };
  }

  confirmPasswordValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = this.passwordUsuario?.value;
    const confirmPassword = control.value;
    return password === confirmPassword ? null : { 'passwordMismatch': true };
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const formData = this.form.value;
    formData.idUsuario = this.idUsuario;
    if (this.idUsuario) {
      this.userService.updateUsuario(formData).subscribe({
        next: (response) => {
          this.alertService
            .success({
              message: 'Usuario actualizado correctamente.',
            })
            .then(() => {
              this.closeModal();
              this.dataUpdated.emit();
              //$(this.modal?.nativeElement as any).modal('hide');
            });
        },
        error: (error) => {
          this.alertService.error({
            message: error,
          });
        },
      });
    }
  }

  // ngAfterViewInit() {
  //   $('#updateUsuario').on('hidden.bs.modal', () => {
  //     this.closeModal();
  //   });
  // }

  closeModal() {
    this.form.reset();
     this.showForm?.setValue(false);
     this.toggleFormulario();
  }

  get showForm() {
    return this.form.get('showForm');
  }

  get nombres() {
    return this.form.get('nombres');
  }

  get apellidos() {
    return this.form.get('apellidos');
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

