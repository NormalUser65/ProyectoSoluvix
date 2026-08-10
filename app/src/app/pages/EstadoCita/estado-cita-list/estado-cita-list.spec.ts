import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoCitaList } from './estado-cita-list';

describe('EstadoCitaList', () => {
  let component: EstadoCitaList;
  let fixture: ComponentFixture<EstadoCitaList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstadoCitaList],
    }).compileComponents();

    fixture = TestBed.createComponent(EstadoCitaList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
