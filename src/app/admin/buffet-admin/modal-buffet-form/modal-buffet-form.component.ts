import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { IBuffetService } from '../../../core/services-admin/buffet/IBuffet.service';
import { Observable, Subscription } from 'rxjs';
import { Buffet } from '../../../core/models/buffet.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../../core/services-admin/alert/alert.service';
import { ModalService } from '../../../core/services-admin/modal/modal.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-modal-buffet-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './modal-buffet-form.component.html',
  styleUrls: ['./modal-buffet-form.component.css']
})
export class ModalBuffetFormComponent {

  form!: FormGroup;
  @Output() valueForm = new EventEmitter();

  @Input() buffetService!: IBuffetService;

  isEditMode = false;
  
  private subscription = new Subscription();

  modalPayload: { mode: 'create' | 'edit' | 'view' | 'task' | 'resolution', data: Buffet | null} | null = null;

  private fb = inject(FormBuilder);
  private alertService = inject(AlertService);
  private modalService = inject(ModalService);

  ngOnInit() {
    this.createForm();
    const sub = this.modalService.getModalData().subscribe(payload => {
      this.modalPayload = payload;
      if (payload) {
        this.isEditMode = payload.mode === 'edit';
        this.isEditMode ? this.fillForm(payload.data) : this.resetFormState();
      }
    });
    this.subscription.add(sub);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  fillForm(data: Partial<Buffet>) {
    this.form.patchValue({
      name: data.name,
      description: data.description,
      img: data.img,
      latitud: data.latitud,
      longitud: data.longitud
    });
  }

  isOpen(): boolean {
    return this.modalPayload !== null;
  }

  close() {
    this.resetFormState();
    this.modalService.closeModal();
  }

  private resetFormState(): void {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  private createForm() {
    this.form = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      img: ['', Validators.required],
      latitud: ['', Validators.required],
      longitud: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formData = this.form.getRawValue();

    let request$: Observable<any>;

    request$ = (
      this.modalPayload?.mode === 'edit' && this.modalPayload.data
        ? this.buffetService.update(this.modalPayload.data.code!, formData)
        : this.buffetService.register(formData)
    ) as Observable<any>;

    request$.subscribe({
      next: () => {
        const successMessage = this.isEditMode
          ? 'Buffet actualizado correctamente.'
          : 'Buffet registrado correctamente.';

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

  get name() {
    return this.form.get('name');
  }
  get description() {
    return this.form.get('description');
  }
  get img() {
    return this.form.get('img');
  }
  get latitud() {
    return this.form.get('latitud');
  }
  get longitud() {
    return this.form.get('longitud');
  }

}
