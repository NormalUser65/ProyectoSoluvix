import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfesionalEspecialidadList } from './profesional-especialidad-list';

describe('ProfesionalEspecialidadList', () => {
  let component: ProfesionalEspecialidadList;
  let fixture: ComponentFixture<ProfesionalEspecialidadList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfesionalEspecialidadList],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfesionalEspecialidadList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
