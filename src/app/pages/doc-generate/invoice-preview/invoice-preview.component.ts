import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { InvoiceServiceService } from '../services/invoice-service.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
          // console.log(response);
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

    //  setTimeout(() => this.printPage(), 5000);
  }

  printPage(){
    // this.isDisplayed = true;
    // window.print();
    this.openPDF();
    // this.isDisplayed = false;
  }

  ngAfterContentInit(): void{
  // this.printPage();
  }

  goBack(): void {
    this.location.back();
  }

  public openPDF(): void {
    const contentElement = document.getElementById('print-sheet2');
    // this.isDisplayed = true;
    // if(contentElement){
    //   this.adjustFontSize(contentElement, '12px');
    // }
    const pdf = new jsPDF('p', 'pt', 'letter');


    const margins = {
      top: 30,
      left: 30,
      bottom: 30,
      right: 30
    };

    // Define the width and height of the PDF page
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Calculate the usable width and height
    const usableWidth = pageWidth - margins.left - margins.right;
    const usableHeight = pageHeight - margins.top - margins.bottom;

    if(contentElement){
      html2canvas(contentElement, {
        scale: 2
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
  
        // Calculate the image width and height to fit within the usable area
        const imgWidth = usableWidth;
        const imgHeight = (canvas.height * usableWidth) / canvas.width;
  
        // Add the image to the PDF with the specified margins
        pdf.addImage(imgData, 'JPEG', margins.left, margins.top, imgWidth, imgHeight);
  
        // Save the PDF
        pdf.save('Invoice-'+this.invoiceData.invoiceNumber);
      }).catch((error) => {
        console.error('Error generating PDF:', error);
      });
    }
    
  //   const options = {
  //     html2canvas: {},
  //     callback: () => {
  //       pdf.save('invoice.pdf');
  //     }
  //   };
  //   const content = this.pdfContent.nativeElement;
  //   if(contentElement){
  //   pdf.html(contentElement, {
  //     callback: () => {
  //       pdf.save('invoice.pdf');
  //     }
  //   });
  // }else{
  //   console.log('empty');
  // }
  // this.isDisplayed = false;
  }

  adjustFontSize(content: HTMLElement, fontSize: string) {
    // Get all elements within the content element
    const elements = content.querySelectorAll('*');

    // Set font size for each element
    elements.forEach((element: any) => {
      element.style.fontSize = fontSize;
    });
  }

}
