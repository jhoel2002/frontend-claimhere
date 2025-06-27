import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { ModalService } from '../../../core/services-admin/modal/modal.service';
import { IRequestService } from '../../../core/services-admin/request/IRequest.service';
import { AlertService } from '../../../core/services-admin/alert/alert.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AUTH_SERVICE_TOKEN, BUFFET_SERVICE_TOKEN } from '../../../core/models/token-injection.model';
import { CommonModule } from '@angular/common';
import { CaseRequest } from '../../../core/models/case-request.model';

@Component({
  selector: 'app-modal-request-task',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './modal-request-task.component.html',
  styleUrls: ['./modal-request-task.component.css']
})
export class ModalRequestTaskComponent implements OnInit {

  modalPayload: { mode: 'create' | 'edit' | 'view' | 'task' | 'resolution', data: any | null} | null = null;
  
  caseRequest!: CaseRequest;

  subscription = new Subscription();

  authService = inject(AUTH_SERVICE_TOKEN);
  buffetService = inject(BUFFET_SERVICE_TOKEN);

  @Input() requestService!: IRequestService;
  @Input() modalService!: ModalService;

  alertService = inject(AlertService);
  fb = inject(FormBuilder);
  
  form!: FormGroup;

  isopenModal:boolean = false;
  
  listStatus: string[] = ['PENDIENTE','EN PROCESO','FINALIZADO'];

  listTypesTask: string[] = [];

  showOtherTaskInput = false;

  ngOnInit() {
    this.createForm();
    const sub = this.modalService.getModalData().subscribe(payload => {
      if (payload && payload.mode === 'task') {
        this.modalPayload = payload;
        this.caseRequest = payload.data;
        this.isopenModal = true;
        this.chargeHistoryTask(payload.data.code);
      }
    });
    this.subscription.add(sub);
    const sub2 = this.buffetService.getTypeOfTaskByBuffet(this.authService.userBuffet).subscribe({
      next: (types: string[]) => {
        this.listTypesTask = types;
      }
    });
    this.subscription.add(sub2);
    const sub3 = this.task!.valueChanges
    .subscribe(value  => {
      this.showOtherTaskInput = value === 'OTHERS';
      if (this.showOtherTaskInput) {
        this.form.get('otherTask')?.setValidators([Validators.required]);
      } else {
        this.form.get('otherTask')?.clearValidators();
      }
    this.form.get('otherTask')?.updateValueAndValidity();
    });
    this.subscription.add(sub3);
  }

  chargeHistoryTask(codeCase: string): void{
    const sub = this.requestService.getTasksByRequestCode(codeCase).subscribe({
      next: (data: any) => {
        this.caseRequest.tasks = data;
      },
      error: (error: any) => {
        this.alertService.error({message:'Error al cargar los datos de la tarea.'});
      }
    });
    this.subscription.add(sub);
  }

  createForm():void {
    this.form = this.fb.group({
      task: ['', Validators.required],
      status: ['', Validators.required],
      comentary: ['', Validators.required],
      otherTask: ['']
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
    this.requestService.addTaskToRequest(this.caseRequest.code, payload).subscribe({
      next: () => {
        this.alertService.success({ message: "Tarea creada exitosamente" }).then(() => {
          this.resetFormState()
        });
      },
      error: (error: any) => {
        this.alertService.error({ message: error });
      }
    });
  }
  
  get task() { 
    return this.form.get('task'); 
  }

  get status() { 
    return this.form.get('status'); 
  }

  get comentary() { 
    return this.form.get('comentary'); 
  }

  get otherTask() { 
    return this.form.get('otherTask'); 
  }


  // get lawyer(): FormControl { 
  //   return this.form.get('lawyer') as FormControl; 
  // }

  // get customer(): FormControl { 
  //   return this.form.get('customer') as FormControl; 
  // }

}
