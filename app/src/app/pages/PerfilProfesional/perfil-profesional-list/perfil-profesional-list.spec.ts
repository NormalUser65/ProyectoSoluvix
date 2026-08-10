import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilProfesionalList } from './perfil-profesional-list';

describe('PerfilProfesionalList', () => {
  let component: PerfilProfesionalList;
  let fixture: ComponentFixture<PerfilProfesionalList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilProfesionalList],
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilProfesionalList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
