import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Location } from '@angular/common'; 

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmationDialogComponent>, private location: Location) {}

  goBack(): void {
    this.location.back();
  }
}
