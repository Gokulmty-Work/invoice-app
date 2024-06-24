import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { InvoiceServiceService } from '../services/invoice-service.service';
import { DatePipe } from '@angular/common';
import { SharedService } from 'src/app/services/shared.service';
import { forkJoin } from 'rxjs';


export interface Transaction {
  recordId: number,
  invoceNumber: string;
  invoiceDate: string;
  buyerDetails: string;
};

export interface DisplayFields {
  recordId: number,
  invoiceNumber: string;
  invoiceDate: string;
  buyerDetails: string;
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
export class GenListComponent implements OnInit{
  displayedColumns: string[] = ['invoceNumber', 'invoiceDate', 'buyerDetails', 'fileDownload'];
  dataSource: any;
  filterEvent: any;
  isTableEmpty: boolean = true;
  totalData: number = 0;
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('searchInput') searchInput!: ElementRef;
  // private formSubscription: Subscription;

  constructor(public dialog: MatDialog, 
    private invoiceService: InvoiceServiceService, 
    private datePipe: DatePipe,
    private sharedService: SharedService) {
    // Initialize your form and data source here
    // this.formSubscription = this.campaignOne.valueChanges.subscribe(() => {
    //   this.onDateRangeChange();
    // });
    // this.formSubscription.add(this.campaignTwo.valueChanges.subscribe(() => {
    //   this.onDateRangeChange();
    // }));

    this.dataSource = new MatTableDataSource<DisplayFields>();
  }

  ngOnInit(): void {
    this.getInvoiceData();
  }

  getInvoiceData(){
    const currentPage = this.paginator.pageIndex || 0;
    const pageSize = this.paginator.pageSize || 10;

    forkJoin({
      filterData: this.invoiceService.getInvoiceList(currentPage,pageSize),
      invoiceCount: this.invoiceService.getInvoiceCount()
    }).subscribe({
        next: ({filterData, invoiceCount}) => {
          if(filterData && filterData.length){
          this.isTableEmpty = false;
          const modifiedResponseArray = this.modifyResponseArray(filterData);
          this.dataSource.data = modifiedResponseArray;
          this.paginator.length = invoiceCount;
          // this.initializePaginator();
        }else {
          this.isTableEmpty = true;
          }
        },
        error: (error) => {
          console.log('Error',error);
        }
      });


    // this.invoiceService.getInvoiceList(currentPage,pageSize).subscribe(
    //   {
    //     next: (response) => {
    //       if(response && response.length){
    //       this.isTableEmpty = false;
    //       const modifiedResponseArray = this.modifyResponseArray(response);
    //       this.dataSource.data = modifiedResponseArray;
    //       this.dataSource.length = 15;
    //       // this.initializePaginator();
    //       this.totalData = 15;
    //       }else {
    //       this.isTableEmpty = true;
    //       }
    //     },
    //     error: (error) => {
    //       console.log('Error',error);
    //     }
    //   }
    // );
  }

  modifyResponseArray(response: any){
    return response.map((obj: any) => {
      return {
        invoiceNumber: obj.invoiceNumber,
        invoiceDate: obj.invoiceDate,
        recordId: obj.id,
        soldTo: obj.soldTo
      };
    });
  }

  applyFilter(event: Event) {
    this.filterEvent = event;
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if(filterValue){

      forkJoin({
        filterData: this.invoiceService.filterData(filterValue),
        invoiceCount: this.invoiceService.getInvoiceCount()
      }).subscribe({
          next: ({filterData, invoiceCount}) => {
            if(filterData && filterData.length){
            this.isTableEmpty = false;
            const modifiedResponseArray = this.modifyResponseArray(filterData);
            this.dataSource.data = modifiedResponseArray;
            this.paginator.length = invoiceCount;
            // this.initializePaginator();
          }else {
            this.isTableEmpty = true;
            }
          },
          error: (error) => {
            console.log('Error',error);
          }
        });


      // this.invoiceService.filterData(filterValue).subscribe(
      //   {
      //     next: (response) => {
      //       if(response && response.length){
      //       this.isTableEmpty = false;
      //       const modifiedResponseArray = this.modifyResponseArray(response);
      //       this.dataSource.data = modifiedResponseArray;
      //       this.paginator.length = 15;
      //       // this.initializePaginator();
      //     }else {
      //       this.isTableEmpty = true;
      //       }
      //     },
      //     error: (error) => {
      //       console.log('Error',error);
      //     }
      //   });
    }else {
      this.getInvoiceData();
      this.filterEvent = '';
    }
   
    // this.dataSource.filter = filterValue;
  }

  campaignOne = new FormGroup({
    start: new FormControl(new Date(year, month, today.getDate() - 3)),
    end: new FormControl(new Date(year, month, today.getDate())),
  });
  
  onDateRangeChange() {
    const startDateControl = this.campaignOne.get('start');
    const endDateControl = this.campaignOne.get('end');
    if (startDateControl && startDateControl.value && endDateControl && endDateControl.value) {
      const startDate = this.formatDate(startDateControl.value);
      const endDate = this.formatDate(endDateControl.value);

      forkJoin({
        dateRangeSearch: this.invoiceService.dateRangeSearch(startDate, endDate),
        invoiceCount: this.invoiceService.getInvoiceCount()
      }).subscribe({
        next: ({ dateRangeSearch, invoiceCount }) => {
          if (dateRangeSearch && dateRangeSearch.length) {
            this.isTableEmpty = false;
            const modifiedResponseArray = this.modifyResponseArray(dateRangeSearch);
            this.dataSource.data = modifiedResponseArray;
            this.paginator.length = invoiceCount; 
          } else {
            this.isTableEmpty = true;
          }
        },
        error: (error) => {
          console.log('Error', error);
        }
      });

      // this.invoiceService.dateRangeSearch(startDate,endDate).subscribe(
      //   {
      //     next: (response) => {
      //       if(response && response.length){
      //       this.isTableEmpty = false;
      //       const modifiedResponseArray = this.modifyResponseArray(response);
      //     this.dataSource.data = modifiedResponseArray;
      //     this.paginator.length = 15;
      //     // this.initializePaginator();
      //   }else {
      //     this.isTableEmpty = true;
      //     }
      //     },
      //     error: (error) => {
      //       console.log('Error',error);
      //     }
      //   }
      // );
    } else {
    //   this.dataSource.filter = '';
    //   this.dataSource = new MatTableDataSource<DisplayFields>([]);
    // this.initializePaginator(); 
    this.getInvoiceData();
    }
  }

  
  initializePaginator() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource.sortingDataAccessor = (item: any, property: any) => {
      console.log('Sort',item,property);
      switch (property) {
        case 'invoiceNumber': return item.invoiceNumber;
        case 'invoiceDate': return item.invoiceDate;
        case 'soldTo': return item.soldTo;
        default: return item[property];
      }
    };
  }

  formatDate(dateString: any): any {
    // const date = new Date(dateString);
    return this.datePipe.transform(dateString, 'yyyy-MM-dd HH:mm:ss.SSS') || '';
  }

  deleteRecord(data: any){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { message: 'Are you sure you want to delete this record?' }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        console.log('Deleting record:', data);
        this.deleteInvoice(data);
      } else {
        console.log('Deletion canceled');
      }
    });
  }

  deleteInvoice(data: any){
    this.invoiceService.deleteInvoice(data.recordId).subscribe(
      {
        next: (response) => {
          console.log('Deleted',response);
          this.sharedService.openSnackBar('Invoice Deleted');
          this.getInvoiceData();
        },
        error: (error) => {
          console.log('Error',error);
          this.getInvoiceData();
        }
      }
    );
    if(this.filterEvent){
      this.applyFilter(this.filterEvent);
    }else {
      this.getInvoiceData();
    }
  }

  clearFilter(){
    this.getInvoiceData();
    this.campaignOne.patchValue({
      start: new Date(year, month, today.getDate()),
      end: new Date(year, month, today.getDate() + 3)
    });
    this.searchInput.nativeElement.value = '';
  }

  ngOnDestroy() {
    // this.formSubscription.unsubscribe();
  }
}
