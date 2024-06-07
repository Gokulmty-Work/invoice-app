import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SnackbarComponent } from '../pages/doc-generate/snackbar/snackbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private http: HttpClient, private _snackBar: MatSnackBar,) { }

  private apiUrlAuth = environment.apiUrl+`/auth`;
  private uploadSuccess = new Subject<void>();
  uploadSuccess$ = this.uploadSuccess.asObservable();

  getProfilePhoto(id: number): Observable<Blob> {
    //  return this.http.get(`${this.baseUrl}/profilePhoto/${id}`);
      return this.http.get(`${this.apiUrlAuth}/profilePhoto/${id}`,{ responseType: 'blob' });
  }

  openSnackBar(message: string) {
    this._snackBar.openFromComponent(SnackbarComponent, {
      data: { message: message},
      duration: 3000,
    });
  }

  emitUploadSuccess() {
    this.uploadSuccess.next();
  }
}
