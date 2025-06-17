/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ModalBuffetFormComponent } from './modal-buffet-form.component';

describe('ModalBuffetFormComponent', () => {
  let component: ModalBuffetFormComponent;
  let fixture: ComponentFixture<ModalBuffetFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalBuffetFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalBuffetFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
