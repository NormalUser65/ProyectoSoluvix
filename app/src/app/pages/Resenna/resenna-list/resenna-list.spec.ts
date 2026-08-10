import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResennaList } from './resenna-list';

describe('ResennaList', () => {
  let component: ResennaList;
  let fixture: ComponentFixture<ResennaList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResennaList],
    }).compileComponents();

    fixture = TestBed.createComponent(ResennaList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
