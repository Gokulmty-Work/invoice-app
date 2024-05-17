import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenFileDownloadComponent } from './gen-file-download.component';

describe('GenFileDownloadComponent', () => {
  let component: GenFileDownloadComponent;
  let fixture: ComponentFixture<GenFileDownloadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenFileDownloadComponent]
    });
    fixture = TestBed.createComponent(GenFileDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
