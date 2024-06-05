import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthServiceService } from '../services/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class AppSideLoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  isProcessing: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthServiceService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      rememberDevice: [false]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isProcessing = true;
      const username = this.loginForm.value.username;
      const password = this.loginForm.value.password;
      const rememberDevice = this.loginForm.value.rememberDevice;

      // Call AuthService method to authenticate user
      this.authService.loginUser(username, password).subscribe(
        {
          next: (response)=> {
            if(!response.apiResponse.errorCode)
              {
                if (rememberDevice) {
                  localStorage.setItem('userData', JSON.stringify(response));
                }
                sessionStorage.setItem('userData', JSON.stringify(response))
                this.authService.setUserData(response);
                this.router.navigate(['/home/list']);
              }else {
            this.errorMessage = 'Incorrect Email Id / Password';
            this.isProcessing = false;
              }
            
          },
          error: (error) => {
            console.log(error);
            this.isProcessing = false;
            this.errorMessage = 'Error. Please contact Admin.';
          }
        });
    } else {
      // Handle form validation errors
    }
  }
}
