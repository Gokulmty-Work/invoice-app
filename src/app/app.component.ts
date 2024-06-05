import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from './pages/authentication/services/auth-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'Admin Tempplate';

  constructor(private authService: AuthServiceService){}

  ngOnInit(): void {
    this.authService.initUserData();
  }
}
