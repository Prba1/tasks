import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoliComponent } from './holi.component';

describe('HoliComponent', () => {
  let component: HoliComponent;
  let fixture: ComponentFixture<HoliComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HoliComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HoliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
