import { Injectable } from '@angular/core';
import * as PizZip from 'pizzip';
import * as Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocGenService {

  constructor(private http: HttpClient) { }
  private apiUrl = environment.apiUrl;

  generateDoc(data: any): void {
    const paginatedData = this.splitInvoiceLineItems(data);  // Split the data into pages
    const preprocessedData = this.preprocessData(paginatedData);  // Preprocess the data
    const addInvoiceDetails = this.addInvoiceDetails(preprocessedData, data);
    console.log(addInvoiceDetails);
    // const addEmptyRows = this.addEmptyRows(addInvoiceDetails)
    // Load the docx file as a binary
    fetch('/assets/template.docx')
      .then(response => response.arrayBuffer())
      .then(content => {
        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip, {
          paragraphLoop: true,
          linebreaks: true,
        });

        // Render the document (replace all occurrences of {key} by data[key])
        doc.render(addInvoiceDetails);

        const out = doc.getZip().generate({
          type: "blob",
          mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });

        // Output the document using FileSaver
        saveAs(out, "Invoice-"+ data.invoiceNumber);


        // --- Print PDF 

        // const formData = new FormData();
        // formData.append('file', out);
        // const headers = new HttpHeaders({
        //   'Authorization': 'Bearer your_token_here' // Example header
        // });
        // this.http.post(`${this.apiUrl}/doc/convertDocToPDF`, formData, { headers: headers, responseType: 'blob'  }).subscribe(
        //   {
        //     next: (response: Blob) => {
        //       console.log(response);
        //       -------------------------------
              // window.open("data:application/pdf," + escape(error.error.text));
              // var mediaType = 'application/pdf';
              // var blob = new Blob([response], {type: mediaType});

              // var filename = 'test.pdf';
              // saveAs(response, filename);
        //     ----------------------
        //       const blobUrl = URL.createObjectURL(response);
        // const printWindow = window.open(blobUrl);

        // if (printWindow) {
        //   printWindow.onload = () => {
        //     printWindow.focus();
        //     printWindow.print();
        //     URL.revokeObjectURL(blobUrl); // Clean up the URL object
        //   };
        // }
        //     },
        //     error: (error) => {
        //       console.log(error);
        //     }
        //   }
        // );
        });
  }

  // Helper functions
  private preprocessData(data: any): any {
    if (Array.isArray(data)) {
      return data.map(this.preprocessData.bind(this));
    } else if (data && typeof data === 'object') {
      const result: any = {};
      for (const key of Object.keys(data)) {
        result[key] = data[key] === undefined ? '' : this.preprocessData(data[key]);
      }
      return result;
    } else {
      return data;
    }
  }

  private splitInvoiceLineItems(data: any): any {
    const maxEntriesFirstPage = 22;
    const maxEntriesOtherPages = 26;

    let pages: any[] = [];
    let startIndex = 0;
    let grandTotal = 0;

    const parseAmount = (amount: string): number => {
        return parseFloat(amount.replace(/[$,]/g, '')) || 0;
    };

    while (startIndex < data.invoiceLineItems.length) {
        const maxEntries: number = pages.length === 0 ? maxEntriesFirstPage : maxEntriesOtherPages;
        let endIndex = startIndex + maxEntries;
        let items = data.invoiceLineItems.slice(startIndex, endIndex);

        // Fill with empty rows if items are less than max entries
        while (items.length < maxEntries) {
            items.push({ styleNumber: '', description: '', quantityOrdered: '', quantityShipped: '', unitPrice: '', amount: '' });
        }

        // Calculate the page total
        let pageTotal = items.reduce((sum:any, item:any) => sum + parseAmount(item.amount), 0);
        grandTotal += pageTotal;

        pages.push({
            ...data,
            invoiceNumber: `${data.invoiceNumber} (page ${pages.length + 1})`,
            invoiceLineItems: items,
            totalAfterTax: `$${pageTotal.toFixed(2)}`,
            frieightDescription: '',
            frieghtCharges: '',
            taxDescription: '',
            taxPercent: '',
            taxAmount: ''
        });

        startIndex = endIndex;
    }

    // Handle the case where there are no invoice line items (create at least one page)
    if (pages.length === 0) {
        let items: any[] = [];
        for (let i = 0; i < maxEntriesFirstPage; i++) {
            items.push({ styleNumber: '', description: '', quantityOrdered: '', quantityShipped: '', unitPrice: '', amount: '' });
        }

        pages.push({
            ...data,
            invoiceNumber: `${data.invoiceNumber} (page 1)`,
            invoiceLineItems: items,
            totalAfterTax: `$${parseAmount(data.totalAfterTax).toFixed(2)}`,
            frieightDescription: data.frieightDescription,
            frieghtCharges: data.frieghtCharges,
            taxDescription: data.taxDescription,
            taxPercent: data.taxPercent,
            taxAmount: data.taxAmount
        });
    } else {
        // Ensure the last page includes the freight and tax details and the grand total
        pages[pages.length - 1] = {
            ...pages[pages.length - 1],
            totalAfterTax: `$${parseAmount(data.totalAfterTax).toFixed(2)}`,
            frieightDescription: data.frieightDescription,
            frieghtCharges: data.frieghtCharges,
            taxDescription: data.taxDescription,
            taxPercent: data.taxPercent,
            taxAmount: data.taxAmount
        };
    }

    return { pages };
}

  private addInvoiceDetails(processedData:any, data:any){
    processedData.invoiceNumber = data.invoiceNumber;
    processedData.invoiceDate = this.formatDate(data.invoiceDate);
    processedData.soldTo = data.soldTo;
    processedData.shipTo = data.shipTo;
    return processedData;
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}-${day}-${year}`;
  }

  private openPrintDialog(htmlContent: string): void {
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if(printWindow){
      printWindow.document.write(htmlContent);
      printWindow.document.close(); // Necessary for some browsers
      printWindow.focus(); // Necessary for some browsers
      printWindow.print();
      printWindow.onafterprint = () => printWindow.close();
    }
  }
}
