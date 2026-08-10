import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilProfesionalCreatePage } from './perfilProfesional-create-page';

describe('PerfilProfesionalCreatePage', () => {
  let component: PerfilProfesionalCreatePage;
  let fixture: ComponentFixture<PerfilProfesionalCreatePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilProfesionalCreatePage],
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilProfesionalCreatePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});