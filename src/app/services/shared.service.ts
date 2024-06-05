import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private http: HttpClient) { }

  private apiUrlAuth = environment.apiUrl+`/auth`;

  getProfilePhoto(id: number): Observable<Blob> {
    //  return this.http.get(`${this.baseUrl}/profilePhoto/${id}`);
      return this.http.get(`${this.apiUrlAuth}/profilePhoto/${id}`,{ responseType: 'blob' });
  }
}
