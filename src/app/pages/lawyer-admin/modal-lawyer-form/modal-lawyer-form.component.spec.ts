/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ModalLawyerFormComponent } from './modal-lawyer-form.component';

describe('ModalLawyerFormComponent', () => {
  let component: ModalLawyerFormComponent;
  let fixture: ComponentFixture<ModalLawyerFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalLawyerFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalLawyerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
