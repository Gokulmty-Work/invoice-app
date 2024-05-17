import { Component, HostListener } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';

import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-upload-docs',
  templateUrl: './upload-docs.component.html',
  styleUrls: ['./upload-docs.component.scss']
})
export class UploadDocsComponent {
  ordersForm!: FormGroup;
  navigatingAway = false;
  invoiceDate;
  
  constructor(private fb: FormBuilder, private dialog: MatDialog, private location: Location) {
    this.invoiceDate = new Date(); 
    this.ordersForm = this.fb.group({
      ourOrder: [''],
      yourOrderNumber: [''],
      deptNumber: [''],
      shipVia: [''],
      terms: [''],
      salesman: [''],
      orders: this.fb.array([])
    });

    // Initialize with one empty order row
    this.addRow();
  }

  ngOnInit() {
  }

  addRow() {
    const control = this.ordersForm.get('orders') as FormArray;
    control.push(this.createOrder());
  }

  createOrder(): FormGroup {
    return this.fb.group({
      orderNumber: [''],
      description: [''],
      quantityOrdered: ['', Validators.pattern('^[0-9]*$')],
      quantityShipped: ['', Validators.pattern('^[0-9]*$')],
      unitPrice: ['', Validators.pattern('^[0-9]*$')],
      amount: ['']
    });
  }

  get orders() {
    return (this.ordersForm.get('orders') as FormArray).controls;
  }

  get totalItems(): number {
    const control = this.ordersForm.get('orders') as FormArray;
    let total = 0;
    control.controls.forEach((orderGroup) => {
      const amount = orderGroup.get('quantityShipped')?.value || 0;
      total += parseInt(amount);
    });
    return total;
  }

  get totalAmount(): number {
    const control = this.ordersForm.get('orders') as FormArray;
    let total = 0;
    control.controls.forEach((orderGroup) => {
      const quantityShipped = orderGroup.get('quantityShipped')?.value || 0;
      const unitPrice = orderGroup.get('unitPrice')?.value || 0;
      const totalAmount = quantityShipped * unitPrice;
      total += totalAmount;
    });
    return total;
  }

  deleteRow(index: number) {
    const control = this.ordersForm.get('orders') as FormArray;
    control.removeAt(index);
  }

  calculateAmount(index: number): string {
    const control = this.ordersForm.get('orders') as FormArray;
    const orderGroup = control.at(index) as FormGroup;
    const quantityShipped = orderGroup.get('quantityShipped')?.value || 0;
    const unitPrice = orderGroup.get('unitPrice')?.value || 0;
    const amount = quantityShipped * unitPrice;
    return amount.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
  }

  goBack(): void{
    if (this.isDataChanged()) {
      this.openConfirmationDialog();
    }else {
    this.location.back();
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.isDataChanged()) {
      $event.returnValue = true;
    }
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    this.goBack();
  }

  isDataChanged(): boolean {
    return this.ordersForm.dirty && Object.keys(this.ordersForm.value).length > 0;
  }

  openConfirmationDialog(): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);
    return dialogRef.afterClosed();
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.isDataChanged() && !this.navigatingAway) {
      return this.openConfirmationDialog();
    }
    return true;
  }
}