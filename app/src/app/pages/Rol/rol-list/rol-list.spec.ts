import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolList } from './rol-list';

describe('RolList', () => {
  let component: RolList;
  let fixture: ComponentFixture<RolList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolList],
    }).compileComponents();

    fixture = TestBed.createComponent(RolList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
