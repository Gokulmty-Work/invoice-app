import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { InvoiceServiceService } from '../services/invoice-service.service';
// import jsPDF from 'jspdf';


@Component({
  selector: 'app-invoice-preview',
  templateUrl: './invoice-preview.component.html',
  styleUrls: ['./invoice-preview.component.scss']
})
export class InvoicePreviewComponent implements OnInit{
  @ViewChild('pdfContent') pdfContent!: ElementRef;
  invoiceId: string | null = null;
  invoiceData: any | null = null;
  isDisplayed: boolean = false;
    
  constructor(private location: Location, 
    private route: ActivatedRoute,
    private invoiceService: InvoiceServiceService ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.invoiceId = params.get('id');
      if (this.invoiceId) {
        this.loadInvoice(this.invoiceId);
      }
    });
  }

  loadInvoice(invoiceId: string){
    this.invoiceService.getInvoice(invoiceId).subscribe(
      {
        next: (response) => {
          console.log(response);
          this.setValue(response);
        },
        error: (error) => {
          this.setValue(error);
        }
      }
    );
  }

  setValue(data:any){
    if(!data.id){
       data = {
      id:1,
      invoiceNumber: '2022/1',
      invoiceDate: '04/05/2024',
      soldTo: 'ABC Enterprises, Canada.',
      shipTo: '123 Main Street,Toronto,Ontario,M5V 2B8,Canada.',
      orderNumber: '4654645',
      custOrderNumber: '6464654',
      deptNumber: '5454566',
      shipVia: 'PORT',
      terms: 'NA',
      salesman: 'Yash',
      boxes: 10,
      taxRequired: true,
      taxPercent: 10,
      taxDescription: 'SGST',
      frieghtCharges: 100,
      frieightDescription: 'Shipping',
      totalPreTax: 300,
      totalAfterTax: 330,
      invoiceLineItems: [
        {
          id: 1,
          styleNumber: '65465456',
          description: 'OnePlus Nord CE 4 5G Mobile Edit ',
          quantityOrdered: 10,
          quantityShipped: 10,
          unitPrice: 10,
          amount: 100
        },
        {
          id: 2,
          styleNumber: '65465456',
          description: 'OnePlus Nord CE 4 5G Mobile Edit2 ',
          quantityOrdered: 10,
          quantityShipped: 10,
          unitPrice: 10,
          amount: 100
        }
      ]
      };
    }
    this.invoiceData = data;

     setTimeout(() => this.printPage(), 5000);
  }

  printPage(){
    this.isDisplayed = true;
    window.print();
    this.isDisplayed = false;
  }

  ngAfterContentInit(): void{
  // this.printPage();
  }

  goBack(): void {
    this.location.back();
  }

//   public openPDF(): void {
//     this.isDisplayed = true;
//     const pdf = new jsPDF('p', 'pt', 'letter');
//     const contentElement = document.getElementById('print-sheet');
// const hiddenElement = contentElement?.querySelector('.print-sheet')as HTMLElement;
// if(hiddenElement){
//   hiddenElement.style.display = 'block';
//   hiddenElement.style.fontSize = '10px';
// }

//     const options = {
//       html2canvas: {},
//       callback: () => {
//         pdf.save('invoice.pdf');
//       }
//     };
//     const content = this.pdfContent.nativeElement;
//     if(contentElement){
//     pdf.html(contentElement, {
//       callback: () => {
//         pdf.save('invoice.pdf');
//       }
//     });
//   }else{
//     console.log('empty');
//   }
//   this.isDisplayed = false;
//   }

}
