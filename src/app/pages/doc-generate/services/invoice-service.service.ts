import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InvoiceServiceService {

  constructor(private http: HttpClient) { }

  private apiUrl = environment.apiUrl+`/api/invoice`;

  private headers = new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Access-Control-Allow-Origin', '*');

  createInvoice(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, userData);
  }

  getInvoice(id: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getInvoice/${id}`,{ headers: this.headers });
  }

  updateInvoice(userData: any,id: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/${id}`,userData);
  }

  deleteInvoice(id: any): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`);
  }
}
