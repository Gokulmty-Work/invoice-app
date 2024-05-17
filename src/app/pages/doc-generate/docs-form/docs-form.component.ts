import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-docs-form',
  templateUrl: './docs-form.component.html',
  styleUrls: ['./docs-form.component.scss']
})
export class DocsFormComponent implements OnInit {

  myForm!: FormGroup;

constructor(private formBuilder: FormBuilder) { }

ngOnInit(): void {
  this.myForm = this.formBuilder.group({
    sellerName: ['Brandon', Validators.required],
    buyerName: ['Sansa', Validators.required],
    sellerAddress: ['123 Maple Street, Toronto, ON, M1A 1A1, Canada', Validators.required],
    buyerAddress: ['123 Maple Street, Toronto, ON, M1A 1A1, Canada', Validators.required],
    propertyValue: ['100000', Validators.required],
    mortgageType: ['Variable', Validators.required],
    paymentType: ['Mortgage', Validators.required]
  });
}
}
