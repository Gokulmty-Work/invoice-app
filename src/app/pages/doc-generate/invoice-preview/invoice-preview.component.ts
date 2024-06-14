import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { InvoiceServiceService } from '../services/invoice-service.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import html2PDF from 'html2canvas';
import jspdf from 'jspdf';

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
  isGenerating = false;
  recordsPerPage: number = 15;
  lastPageRecords: number = 12;
  
  pdf!: jsPDF;
  HTML_Width: number = 0;
  HTML_Height: number = 0;
  top_left_margin = 15;
  PDF_Width!: number;
  PDF_Height: number = 0;
  canvas_image_width: number = 0;
  canvas_image_height: number = 0;
    
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
    if(this.invoiceData.length > 12 && this.invoiceData.length < 17){

    }

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

    if(contentElement){
      const htmlWidth = contentElement.clientWidth;
      const htmlHeight = contentElement.clientHeight;
  
      const topLeftMargin = 35;
  
      let pdfWidth = htmlWidth + (topLeftMargin * 2);
      let pdfHeight = (pdfWidth * 1.5) + (topLeftMargin * 2);
  
      const canvasImageWidth = htmlWidth;
      const canvasImageHeight = htmlHeight;
  
      const totalPDFPages = Math.ceil(htmlHeight / pdfHeight) - 1;
  
      const data = document.getElementById('print-sheet2');
      if(data)
      html2canvas(data, { allowTaint: true }).then(canvas => {
  
        canvas.getContext('2d');
        const imgData = canvas.toDataURL("image/jpeg", 1.0);
        let pdf = new jsPDF('p', 'pt', [pdfWidth, pdfHeight]);
        pdf.addImage(imgData, 'jpeg', topLeftMargin, topLeftMargin, canvasImageWidth, canvasImageHeight);
  
        for (let i = 1; i <= totalPDFPages; i++) {
          pdf.addPage([pdfWidth, pdfHeight], 'p');
          pdf.addImage(imgData, 'jpeg', topLeftMargin, - (pdfHeight * i) + (topLeftMargin * 4), canvasImageWidth, canvasImageHeight);
        }
  
        // Save the PDF
        pdf.save('Invoice-'+this.invoiceData.invoiceNumber);
      }).catch((error) => {
        console.error('Error generating PDF:', error);
      });
    }
  }

  adjustFontSize(content: HTMLElement, fontSize: string) {
    // Get all elements within the content element
    const elements = content.querySelectorAll('*');

    // Set font size for each element
    elements.forEach((element: any) => {
      element.style.fontSize = fontSize;
    });
  }

  private calculatePDFHeightWidth(selector: HTMLElement) {
    this.HTML_Width = selector.offsetWidth;
    this.HTML_Height = selector.offsetHeight;
    this.PDF_Width = this.HTML_Width + (this.top_left_margin * 2);
    this.PDF_Height = (this.PDF_Width * 1.2) + (this.top_left_margin * 2);
    this.canvas_image_width = this.HTML_Width;
    this.canvas_image_height = this.HTML_Height;
  }

  generatePDF(elements: HTMLElement[]) {
    this.pdf = new jsPDF('p', 'pt', 'a4');
    this.pdf.setFontSize(2);
    let promise = Promise.resolve();

    elements.forEach((element, index) => {
      promise = promise.then(() => {
        return html2canvas(element, {
          allowTaint: true,
          scale: 2 // Adjust the scale to improve performance
        }).then(canvas => {
          this.calculatePDFHeightWidth(element);

          const imgData = canvas.toDataURL('image/jpeg', 0.75); // Lower image quality to 75%
          if (index > 0) {
            this.pdf.addPage();
          }
          this.pdf.addImage(imgData, 'JPEG', this.top_left_margin, this.top_left_margin, this.HTML_Width, this.HTML_Height);
        });
      });
    });

    promise.then(() => {
      // Save the PDF
      this.pdf.save('Invoice-'+this.invoiceData.invoiceNumber);
      this.isGenerating = false;

      // Generate BLOB object
      // const blob = this.pdf.output('blob');

      // Getting URL of blob object
      // const blobURL = URL.createObjectURL(blob);

      // Show PDF in iframe
      // const iframe = document.getElementById('sample-pdf') as HTMLIFrameElement;
      // iframe.src = blobURL;

      // Set download link
      // const downloadLink = document.getElementById('pdf-download-link') as HTMLAnchorElement;
      // downloadLink.href = blobURL;
    }).catch(error => {
      console.error('Error generating PDF:', error);
      this.isGenerating = false;
    });
  }

  generatePDFPrint() {
    this.isGenerating = true;
    const elements = Array.from(document.getElementsByClassName('print-wrap')) as HTMLElement[];
    this.generatePDF(elements);
  }

  getTotalAmountForPage(pageNumber: number): number {
    const records = this.getRecordsForPage(pageNumber);
    return records.reduce((total, record) => total + record.amount, 0);
  }

  shouldShowBoxes(pageIndex: number): boolean {
    return pageIndex === this.getNumberOfPages() - 1;
  }

  getNumberOfPages(): number {
    const totalRecords = this.invoiceData.invoiceLineItems.length;
    const fullPages = Math.floor(totalRecords / this.recordsPerPage);
    const remainder = totalRecords % this.recordsPerPage;
    return fullPages + (remainder > 0 ? 1 : 0);
  }

  getRecordsForPage(pageNumber: number): any[] {
    const startIndex = (pageNumber - 1) * this.recordsPerPage;
    let endIndex = startIndex + this.recordsPerPage;
    if (endIndex > this.invoiceData.invoiceLineItems.length) {
      endIndex = this.invoiceData.invoiceLineItems.length;
    }
    const records = this.invoiceData.invoiceLineItems.slice(startIndex, endIndex);
    while (records.length < this.recordsPerPage) {
      records.push({ id: '', description: '', amount: '' }); 
    }
    return records;
  }

  createRange(number: number): number[] {
    return new Array(number).fill(0).map((_, i) => i);
  }
}
