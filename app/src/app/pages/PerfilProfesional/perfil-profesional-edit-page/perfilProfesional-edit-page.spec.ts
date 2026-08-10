import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilProfesionalEditPage } from './perfilProfesional-edit-page';

describe('PerfilProfesionalEditPage', () => {
  let component: PerfilProfesionalEditPage;
  let fixture: ComponentFixture<PerfilProfesionalEditPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilProfesionalEditPage],
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilProfesionalEditPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});