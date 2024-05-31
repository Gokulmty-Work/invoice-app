import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { InvoiceServiceService } from '../services/invoice-service.service';

export interface Transaction {
  recordId: number,
  invoceNumber: string;
  invoiceDate: string;
  buyerDetails: string;
  shippingDetails?: string;
};

const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();

@Component({
  selector: 'app-gen-list',
  templateUrl: './gen-list.component.html',
  styleUrls: ['./gen-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GenListComponent {
  displayedColumns: string[] = ['invoceNumber', 'invoiceDate', 'buyerDetails', 'fileDownload'];
  dataSource = new MatTableDataSource<Transaction>(TRANSACTIONS_DATA);
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  // private formSubscription: Subscription;

  constructor(public dialog: MatDialog, private invoiceService: InvoiceServiceService) {
    // Initialize your form and data source here
    // this.formSubscription = this.campaignOne.valueChanges.subscribe(() => {
    //   this.onDateRangeChange();
    // });
    // this.formSubscription.add(this.campaignTwo.valueChanges.subscribe(() => {
    //   this.onDateRangeChange();
    // }));
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  campaignOne = new FormGroup({
    start: new FormControl(new Date(year, month, 13)),
    end: new FormControl(new Date(year, month, 16)),
  });
  
  onDateRangeChange() {
    const startDateControl = this.campaignOne.get('start');
    const endDateControl = this.campaignOne.get('end');
    // Check if both start date and end date are selected
    if (startDateControl && startDateControl.value && endDateControl && endDateControl.value) {
      const startDate = startDateControl.value;
      const endDate = endDateControl.value;
      // Custom filter predicate function
      const filterPredicate = (dataItem: any) => {
        const itemDate = new Date(dataItem.invoiceDate); // Assuming your data has a 'date' property
        return itemDate >= startDate && itemDate <= endDate;
      };
  
      // Assign custom filter predicate function to dataSource
      this.dataSource.filterPredicate = filterPredicate;
      
      // Triggering filtering manually
      this.dataSource.filter = 'trigger'; // You can use any string here
    } else {
      // If either start date or end date is not selected, clear the filter
      this.dataSource.filter = '';
    }
  }

  deleteRecord(data: any){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { message: 'Are you sure you want to delete this record?' }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        // User confirmed deletion, proceed with delete action
        console.log('Deleting record:', data);
        this.deleteInvoice(data);
      } else {
        // User canceled deletion, do nothing
        console.log('Deletion canceled');
      }
    });
  }

  deleteInvoice(data: any){
    data.id= 2;
    this.invoiceService.deleteInvoice(data.id).subscribe(
      {
        next: (response) => {
          console.log(response);
        },
        error: (error) => {
          console.log('Error',error);
        }
      }
    );
  }

  ngOnDestroy() {
    // Unsubscribe from form value changes to prevent memory leaks
    // this.formSubscription.unsubscribe();
  }
}



const TRANSACTIONS_DATA: Transaction[] = [
  {recordId:16, invoceNumber: '16', invoiceDate: '05/05/2024', buyerDetails: 'HMT Industries'},
  {recordId:15, invoceNumber: '15', invoiceDate: '05/01/2024', buyerDetails: 'Cisco'},
  {recordId:14, invoceNumber: '14', invoiceDate: '04/25/2024', buyerDetails: 'Foxcon'},
  {recordId:13, invoceNumber: '13', invoiceDate: '04/20/2024', buyerDetails: 'Boeing'},
  {recordId:12, invoceNumber: '12', invoiceDate: '04/15/2024', buyerDetails: 'Walmart'},
  {recordId:11, invoceNumber: '11', invoiceDate: '04/10/2024', buyerDetails: 'Cisco'},
  {recordId:10, invoceNumber: '10', invoiceDate: '04/05/2024', buyerDetails: 'BHEL'},
  {recordId:9, invoceNumber: '9', invoiceDate: '04/01/2024', buyerDetails: 'Foxcon'},
  {recordId:8, invoceNumber: '8', invoiceDate: '03/30/2024', buyerDetails: 'Airbus'},
  {recordId:7, invoceNumber: '7', invoiceDate: '03/25/2024', buyerDetails: 'BHEL'},
  {recordId:6, invoceNumber: '6', invoiceDate: '03/20/2024', buyerDetails: 'Boeing'},
  {recordId:5, invoceNumber: '5', invoiceDate: '03/15/2024', buyerDetails: 'HMT Industries'},
  {recordId:4, invoceNumber: '4', invoiceDate: '03/10/2024', buyerDetails: 'Cisco'},
  {recordId:3, invoceNumber: '3', invoiceDate: '03/05/2024', buyerDetails: 'Foxcon'},
  {recordId:2, invoceNumber: '2', invoiceDate: '03/01/2024', buyerDetails: 'BHEL'},
  {recordId:1, invoceNumber: '1', invoiceDate: '02/25/2024', buyerDetails: 'Airbus'}
];

