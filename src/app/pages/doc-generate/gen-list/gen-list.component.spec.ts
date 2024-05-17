import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenListComponent } from './gen-list.component';

describe('GenListComponent', () => {
  let component: GenListComponent;
  let fixture: ComponentFixture<GenListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenListComponent]
    });
    fixture = TestBed.createComponent(GenListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
