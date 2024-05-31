import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private apiUrl = environment.apiUrl+`/auth`;
  private userData: any;

  public isAuth = new BehaviorSubject<boolean>(false);
  
  constructor(private http: HttpClient, private router: Router) { }

  initUserData() {
    if (localStorage.getItem('userData')) {
      this.isAuth.next(true);
      this.router.navigate(['home/list']);
  }
  }

  loginUser(username: string, password: string): Observable<any> {
    let inputParams = {email: username, password: password}
    return this.http.post<any>(`${this.apiUrl}/validate`, inputParams);
  }

  getUserData(): any {
    return this.userData;
  }

  setUserData(userData: any) {
    this.isAuth.next(true);
    this.userData = userData;
  }

  logOut() {
    localStorage.removeItem('userData');
    this.isAuth.next(false);
    this.router.navigate(['/authentication/login']);
}
}
