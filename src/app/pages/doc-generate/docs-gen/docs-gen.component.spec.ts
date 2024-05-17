import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocsGenComponent } from './docs-gen.component';

describe('DocsGenComponent', () => {
  let component: DocsGenComponent;
  let fixture: ComponentFixture<DocsGenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocsGenComponent]
    });
    fixture = TestBed.createComponent(DocsGenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
