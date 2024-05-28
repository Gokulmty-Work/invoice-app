import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../../doc-generate/snackbar/snackbar.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CofigServiceService } from '../services/cofig-service.service';
import { passwordMatchValidator } from '../validators/password-match-validator'

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

  constructor(private _snackBar: MatSnackBar, private formBuilder: FormBuilder,private configService: CofigServiceService) {}

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
  this.getProfileImg();
  }
  
  openSnackBar(message: string, action: string) {
    this._snackBar.openFromComponent(SnackbarComponent, {
      data: { message: message},
      duration: 3000,
    });
  }

  switchTabs(tabIndex: number){
    this.selectedTabIndex = tabIndex;
    // this.initForm(tabName);
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
      this.configService.createUser(this.createUserForm.value).subscribe(
        {
          next: (response) => {
          console.log('User created successfully:', response);
          this.openSnackBar('User Created', 'Dismiss');
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
  formData.append('imageFile', file);
  formData.append('profileId', '1');
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
  let id = 1;
  this.configService.getProfileImage(id).subscribe(
    {
      next: (response) => {
        console.log('File DAta:', response);
      },
      error: (error: any) => {
      console.error('Error:', error);
      this.openSnackBar(error, 'Dismiss');
       },
    }
  );
}

 resetInput(){
  const input = document.getElementById('avatar-input-file') as HTMLInputElement;
  if(input){
    input.value = "";
  }
}
}
