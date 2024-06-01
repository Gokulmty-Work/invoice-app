import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InvoiceServiceService {

  constructor(private http: HttpClient) { }

  private apiUrl = environment.apiUrl+`/invoice`;
  private headers = new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Access-Control-Allow-Origin', '*');

  createInvoice(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, userData,{ headers: this.headers });
  }

  getInvoice(id: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getById/${id}`);
  }

  updateInvoice(userData: any,id: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/${id}`,userData);
  }

  deleteInvoice(id: any): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`);
  }

  getInvoiceList(pageNumber: number,pageSize: number): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/getPagedInvoices?page=${pageNumber}&size=${pageSize}`);
  }

  dateRangeSearch(startDate: any,endDate: any): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/searchBetweenDates?start=${startDate}&end=${endDate}`);
  }
}
