import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDocsComponent } from './upload-docs.component';

describe('UploadDocsComponent', () => {
  let component: UploadDocsComponent;
  let fixture: ComponentFixture<UploadDocsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UploadDocsComponent]
    });
    fixture = TestBed.createComponent(UploadDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
