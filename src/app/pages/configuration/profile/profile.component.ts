import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../../doc-generate/snackbar/snackbar.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CofigServiceService } from '../services/cofig-service.service';
import { passwordMatchValidator } from '../validators/password-match-validator'
import { DomSanitizer } from '@angular/platform-browser';
import { AuthServiceService } from '../../authentication/services/auth-service.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit{
  file: string = '';
  userForm!: FormGroup;
  selectedTabIndex: number = 0;
  createUserForm!: FormGroup; 
  selectedFile: any;
  changePasswordForm!: FormGroup;

  constructor(private _snackBar: MatSnackBar, 
    private formBuilder: FormBuilder,
    private configService: CofigServiceService, 
    private sanitizer: DomSanitizer,
    private authService: AuthServiceService,
    private sharedService: SharedService) {}

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
    this.createUserForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordMatchValidator}
  );
   this.changePasswordForm = this.formBuilder.group({
    emailId: [{value: '', disabled: true}, [Validators.required, Validators.email]],
    oldPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  });
  this.getProfileImg();
  this.getUserData();
  this.setUserData();
  }
  
  openSnackBar(message: string, action: string) {
    this._snackBar.openFromComponent(SnackbarComponent, {
      data: { message: message},
      duration: 3000,
    });
  }

  switchTabs(event: any){
     // this.selectedTabIndex = tabIndex;
     console.log('TabEvent',event.index);
     // this.getUserData();
  }

  initForm(tabName: string){
    if(tabName === 'createNewUser'){
      
    }
  }

  onSubmit() {
    if (this.userForm?.valid) {
      console.log(this.userForm?.value);
      // Perform action with form data
      this.openSnackBar('User Data Updated', 'Dismiss');
    } else {
      // Form is invalid, handle accordingly
    }
  }

  createNewUser(){
    if (this.createUserForm?.valid) {
      console.log(this.createUserForm?.value);
      const requestData = this.arrangeData(this.createUserForm.value, 'create new');
      this.configService.createUser(requestData).subscribe(
        {
          next: (response) => {
          console.log('User created successfully:', response);
          this.openSnackBar('User Created', 'Dismiss');
          this.createUserForm.reset();
          },
          error: (error: any) => {
          console.error('Error creating user:', error);
          this.openSnackBar(error, 'Dismiss');
           },
        }
      );
    } else {
      console.log('Form Invalid',this.createUserForm);
      // Form is invalid, handle accordingly
    }
  }

  onFileChange(event: any) {
    const files = event.target.files as FileList;
    if (files.length > 0) {
      const _file = URL.createObjectURL(files[0]);
      this.file = _file;
      this.uploadFile(files[0]);
      this.resetInput();
    }
 }

 uploadFile(file: File) {
  const formData = new FormData();
  const id = this.getUserData().id;
  formData.append('imageFile', file);
  formData.append('profileId', id);
  this.configService.uploadFile(formData).subscribe(
    {
      next: (response) => {
        console.log('File uploaded successfully:', response);
      },
      error: (error: any) => {
      console.error('Error:', error);
      this.openSnackBar(error, 'Dismiss');
       },
    }
  );
}

getProfileImg(){
  let id = this.getUserData().id;
  this.sharedService.getProfilePhoto(id).subscribe(
    {
      next: (response) => {
        console.log(response);

        let objectURL = URL.createObjectURL(response);
        this.selectedFile =  (this.sanitizer.bypassSecurityTrustResourceUrl(objectURL) as any).changingThisBreaksApplicationSecurity;
      },
      error: (error: any) => {
      console.error('Error:', error);
      // this.openSnackBar(error, 'Dismiss');
       },
    }
  );
}

getUserData(): any {
  const userData = this.authService.getUserData();
  return userData;
}

setUserData(){
  const userData = this.getUserData();
  this.userForm.patchValue({
    name: userData.name,
    email: userData.email
  });
  this.changePasswordForm.patchValue({
    emailId: userData.email
  });
}

 resetInput(){
  const input = document.getElementById('avatar-input-file') as HTMLInputElement;
  if(input){
    input.value = "";
  }
}

updatePassword(){
  if (this.changePasswordForm?.valid) {
    const requestData = this.arrangeData(this.changePasswordForm?.value, 'update password');

    this.configService.updatePassword(requestData).subscribe(
      {
        next: (response) => {
          console.log(response);
        this.openSnackBar('Password Updated', 'Dismiss');
        this.changePasswordForm.reset();
        this.setUserData();
        },
        error: (error: any) => {
        console.error('Error:', error);
        this.openSnackBar(error, 'Dismiss');
         },
      }
    );
    // Perform action with form data
  } else {
    // Form is invalid, handle accordingly
  }
}

arrangeData(formData: any,type: string){
const userData = this.getUserData();
let requestData = {};
if(formData && type === 'update password'){
  requestData = {
    "id": userData.id,
    "name": userData.name,
    "email": userData.email,
    "password": formData.oldPassword,
    "changedNewPassword": formData.newPassword
  }
} else if(formData && type === 'create new'){
  requestData = {
    "id": 0,
    "name": '',
    "email": formData.email,
    "password": formData.password,
    "changedNewPassword": ''
  }
}
console.log('req',requestData);
return requestData;
}

ngOnDestroy(): void {
if (this.selectedFile) {
  URL.revokeObjectURL(this.selectedFile as string);
}
}
}
