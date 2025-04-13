import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerAdminComponent } from './customer-admin.component';

describe('ClientAdminComponent', () => {
  let component: CustomerAdminComponent;
  let fixture: ComponentFixture<CustomerAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomerAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
