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
  private apiUrlConfig = environment.apiUrl+`/appParameter`;



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
    const modifiedData = this.convertData(userData);
    return this.http.post<any>(`${this.apiUrlAuth}/register`, userData);
  }

  uploadFile(formData: FormData) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer your_token_here' // Example header
    });
    return this.http.post<any>(`${this.apiUrlAuth}/profilePhoto`, formData, { headers });
  }

  // getProfileImage(id: number){
  //   return this.http.get<any>(`${this.apiUrlAuth}/profilePhoto/${id}`);
  // }



  updatePassword(inputData: any): Observable<any>{
    return this.http.post<any>(`${this.apiUrlAuth}/changePassword`, inputData);
  }

  getConfigData(): Observable<any>{
    return this.http.get(`${this.apiUrlConfig}/`);
  }

  createConfigField(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrlConfig}/create`, userData);
  }

  updateConfigField(userData: any, id: number): Observable<any> {
    console.log('id',id);
    return this.http.put<any>(`${this.apiUrlConfig}/update/${id}`, userData);
  }

  updateAllConfigFields(userData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrlConfig}/updateAll`, userData);
  }

}
