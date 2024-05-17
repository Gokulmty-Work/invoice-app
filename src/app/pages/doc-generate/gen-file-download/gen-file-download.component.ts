import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-gen-file-download',
  templateUrl: './gen-file-download.component.html',
  styleUrls: ['./gen-file-download.component.scss']
})
export class GenFileDownloadComponent {

    constructor(private _snackBar: MatSnackBar) { }

   downloadFile() {
    // Your download logic here
    this._snackBar.open('File Downloaded', 'Close');
  }

}
