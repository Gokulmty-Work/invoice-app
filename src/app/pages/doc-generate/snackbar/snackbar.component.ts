import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss']
})
export class SnackbarComponent {
  constructor(private snackBar: MatSnackBar,@Inject(MAT_SNACK_BAR_DATA) public data: any) { }

  dismissSnackbar() {
    this.snackBar.dismiss();
  }
}
