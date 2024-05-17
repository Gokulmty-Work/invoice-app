import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-invoice-preview',
  templateUrl: './invoice-preview.component.html',
  styleUrls: ['./invoice-preview.component.scss']
})
export class InvoicePreviewComponent {

  constructor(private location: Location) {}

  printPage(){
    window.print();
  }

  ngAfterContentInit(): void{
  this.printPage();
  }

  goBack(): void {
    this.location.back();
  }

}
