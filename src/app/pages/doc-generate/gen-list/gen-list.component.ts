import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

export interface Transaction {
  recordId: number,
  invoceNumber: string;
  invoiceDate: string;
  buyerDetails: string;
  shippingDetails?: string;
};

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

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
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

