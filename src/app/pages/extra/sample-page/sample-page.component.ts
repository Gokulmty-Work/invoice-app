import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
@Component({
  selector: 'app-sample-page',
  templateUrl: './sample-page.component.html',
  styleUrls: ['./sample-page.component.css']
})
export class AppSamplePageComponent implements OnInit {
  step = 0;

  displayedColumns: string[] = ['select', 'name', 'upload', 'uploadedFile', 'status'];
  dataSource = [
    { id:1, selected: false, name: 'Document 1', uploadedFile: '', status: false, processedStatus: '' },
    { id:2, selected: false, name: 'Document 2', uploadedFile: '', status: false, processedStatus: ''},
    { id:3, selected: false, name: 'Document 3', uploadedFile: '', status: false, processedStatus: ''}
  ];
  isFormPanelDisabled: boolean = true;
  isDownloadPanelDisabled: boolean = true;
  isUploadPanelDisabled: boolean = false;
  isProcessing: boolean = false;
  myForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      sellerName: ['Brandon', Validators.required],
      buyerName: ['Sansa', Validators.required],
      sellerAddress: ['123 Maple Street, Toronto, ON, M1A 1A1, Canada', Validators.required],
      buyerAddress: ['123 Maple Street, Toronto, ON, M1A 1A1, Canada', Validators.required],
      propertyValue: ['100000', Validators.required],
      mortgageType: ['Variable', Validators.required],
      paymentType: ['Mortgage', Validators.required]
    });
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  handleFileInput(event: any, row: any) {
    const file = event.target.files[0];
    if (file) {
      let data = this.dataSource.find(item => item.id === row.id);
      row.uploadedFile = file.name;
      row.status = true;
      row.processedStatus = 'Error';
      this.isProcessing = true;
      // You can also upload the file to your server or do other processing here
    }
  }

   downloadFile() {
    // Your download logic here
    this._snackBar.open('File Downloaded', 'Close');
  }
}
