import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CofigServiceService } from '../services/cofig-service.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent {

  userForm!: FormGroup;
  responseData: any;

  constructor(private formBuilder: FormBuilder, private configService: CofigServiceService) { }

  ngOnInit(): void {   
    this.getUserData();
    this.userForm = this.formBuilder.group({
      companyName: ['.', Validators.required],
      phone: ['', Validators.required],
      fax: ['', Validators.required],
      invoiceSerial: ['', Validators.required],
      companyAddress: ['', Validators.required]
    });
  }

  getUserData() {
    this.configService.getConfigData().subscribe(
      {
        next: (response) => {
        const configData = this.convertResponseData(response);
        this.responseData = response;
        this.userForm.patchValue({
          companyName: configData['companyName'],
          phone: configData['phone'],
          fax: configData['fax'],
          invoiceSerial: configData['invoiceSerial'],
          companyAddress: configData['companyAddress']
        });

        },
        error: (error: any) => {
        console.error('Error Retiving Config Data:', error);
         },
      }
    );
  }

  convertResponseData(data: any[]): { [key: string]: string } {
    const convertedData: { [key: string]: string } = {};
    data.forEach(item => {
      convertedData[item.keyField] = item.keyValue;
    });
    return convertedData;
  }
  

  onSubmit() {
    if (this.userForm.valid) {
      // You can handle form submission here
      const convertedFormData = this.convertToKeyValueFormat(this.userForm.value);
      console.log(this.userForm.value,convertedFormData);

      this.checkAndUpdateFields(this.responseData,convertedFormData);

    } else {
      // Form is invalid, handle accordingly
    }
  }


  checkAndUpdateFields(responseData: any[], formData: any[]) {
    let fieldsToUpdate: any[] = [];
    let fieldsToCreate: any[] = [];

    formData.forEach(formField => {
      const responseField = responseData.find(item => item.keyField === formField.keyField);
      console.log(responseField)
      if (!responseField) {
        fieldsToCreate.push(formField);
      } else if (formField.keyValue !== responseField.keyValue) {
        fieldsToUpdate.push(formField);
        formField.id = responseField.id;
      }
    });

    console.log(fieldsToUpdate,fieldsToCreate);

    if (fieldsToUpdate.length === 1) {
      this.configService.updateConfigField(fieldsToUpdate[0],fieldsToUpdate[0].id).subscribe(
        {
          next: (response) => {
           console.log('Updated1', response);
           this.getUserData();
            },
            error: (error: any) => {
            console.error('Error Creating Field:', error);
             },
          }
        );
    } else if (fieldsToUpdate.length > 1) {
      this.configService.updateAllConfigFields(fieldsToUpdate).subscribe(
        {
          next: (response) => {
           console.log('Updated1', response);
           this.getUserData();
            },
            error: (error: any) => {
            console.error('Error Creating Field:', error);
             },
          }
        );
    }

    if (fieldsToCreate.length > 0) {

      fieldsToCreate.forEach(field => {
        this.configService.createConfigField(field).subscribe(
          {
            next: (response) => {
             console.log('Created', response);
             this.getUserData();
              },
              error: (error: any) => {
              console.error('Error Creating Field:', error);
               },
            }
          );
      });
    }
  }

  convertToKeyValueFormat(formData: any): any[] {
    const convertedData: any[] = [];
    for (const key in formData) {
      if (formData.hasOwnProperty(key)) {
        const value = formData[key];
          convertedData.push({ id: 0, keyField: key, keyValue: value });
      }
    }
    return convertedData;
  }
}
