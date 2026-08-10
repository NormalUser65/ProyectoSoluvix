import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalidadList } from './modalidad-list';

describe('ModalidadList', () => {
  let component: ModalidadList;
  let fixture: ComponentFixture<ModalidadList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalidadList],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalidadList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
