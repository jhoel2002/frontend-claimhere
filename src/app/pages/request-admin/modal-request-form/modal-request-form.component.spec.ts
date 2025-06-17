/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ModalRequestFormComponent } from './modal-request-form.component';

describe('ModalRequestFormComponent', () => {
  let component: ModalRequestFormComponent;
  let fixture: ComponentFixture<ModalRequestFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalRequestFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalRequestFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
