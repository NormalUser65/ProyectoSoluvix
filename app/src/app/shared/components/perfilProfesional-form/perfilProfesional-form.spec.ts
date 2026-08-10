import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilProfesionalForm } from './perfilProfesional-form';

describe('PerfilProfesionalForm', () => {
  let component: PerfilProfesionalForm;
  let fixture: ComponentFixture<PerfilProfesionalForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilProfesionalForm],
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilProfesionalForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});