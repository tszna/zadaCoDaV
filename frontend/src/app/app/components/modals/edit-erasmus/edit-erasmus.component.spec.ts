import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditErasmusComponent } from './edit-erasmus.component';

describe('EditErasmusComponent', () => {
  let component: EditErasmusComponent;
  let fixture: ComponentFixture<EditErasmusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditErasmusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditErasmusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
