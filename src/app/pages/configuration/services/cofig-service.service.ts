import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CofigServiceService {

  constructor(private http: HttpClient) { 
  }
  private apiUrl = environment.apiUrl+`/api/appParameter`;
  private apiUrlAuth = environment.apiUrl+`/auth`;


  convertData(formData: any){
    let id = 1;
    const formDataArray = Object.entries(formData).map(([key, value]) => ({
      id: id++,
      keyField: key,
      keyValue: value
    }));
    return formDataArray;
  }

  createUser(userData: any): Observable<any> {
    // const modifiedData = this.convertData(userData);
    return this.http.post<any>(`${this.apiUrlAuth}/register`, userData);
  }

  uploadFile(formData: FormData) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer your_token_here' // Example header
    });
    return this.http.post<any>(`${this.apiUrlAuth}/profilePhoto`, formData, { headers });
  }

  getProfilePhoto(id: number): Observable<Blob> {
    //  return this.http.get(`${this.baseUrl}/profilePhoto/${id}`);
      return this.http.get(`${this.apiUrlAuth}/profilePhoto/${id}`,{ responseType: 'blob' });
  }

  updatePassword(inputData: any): Observable<any>{
    return this.http.post<any>(`${this.apiUrlAuth}/changePassword`, inputData);
  }

  // getUserData(){
  //   let inputParams = {email: username}
  //   return this.http.post<any>(`${this.apiUrlAuth}/validate`, inputParams);
  // }
}
