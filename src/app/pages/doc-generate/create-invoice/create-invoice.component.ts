import { Component, HostListener } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, NavigationStart, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';

import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { InvoiceServiceService } from '../services/invoice-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../snackbar/snackbar.component';

@Component({
  selector: 'app-create-invoice',
  templateUrl: './create-invoice.component.html',
  styleUrls: ['./create-invoice.component.scss']
})
export class CreateInvoiceComponent {
  ordersForm!: FormGroup;
  navigatingAway = false;
  invoiceDate;
  editMode: boolean = false;
  invoiceId: string | null = null;
  isPrint: boolean = false;
  configData: any;
  
  constructor(private fb: FormBuilder,
    private _snackBar: MatSnackBar, 
    private dialog: MatDialog, 
    private location: Location, 
    private route: ActivatedRoute,
    private router: Router,
    private invoiceService: InvoiceServiceService) {
    this.invoiceDate = new Date(); 
    this.ordersForm = this.fb.group({
      invoiceNumber:[''],
      invoiceDate: [this.invoiceDate],
      soldTo: [''],
      shipTo:[''],
      ourOrder: [''],
      yourOrderNumber: [''],
      deptNumber: [''],
      shipVia: [''],
      terms: [''],
      salesman: [''],
      orders: this.fb.array([]),
      frieghtDesc: [''],
      frieghtAmount: [''],
      includeTaxes: [false],
      taxDesc: [{value:'', disabled: true}],
      taxValue:[{value:'', disabled: true}],
      totalBoxes: ['']
    });

    this.includeTaxesControl?.valueChanges.subscribe(checked => {
      if (checked) {
        this.taxDescControl?.enable();
        this.taxValueControl?.enable();
      } else {
        this.taxDescControl?.disable();
        this.taxValueControl?.disable();
      }
    });

    // Initialize with one empty order row
    this.addRow();
  }

  get includeTaxesControl() {
    return this.ordersForm.get('includeTaxes');
  }

  get taxDescControl() {
    return this.ordersForm.get('taxDesc');
  }

  get taxValueControl() {
    return this.ordersForm.get('taxValue');
  }

  ngOnInit() {
    this.getConfigData();
    this.route.paramMap.subscribe(params => {
      this.invoiceId = params.get('id');
      this.editMode = this.invoiceId !== null;
      if (this.editMode && this.invoiceId) {
        this.loadInvoice(this.invoiceId);
      }
    });
  }

  getConfigData(){
    this.configData = {
      companyName: 'Creative Cute Options INC.',
      invoiceSerial: 'Serial Number'
    }
    this.invoiceService.getConfigData().subscribe(
      {
        next: (response) => {
          // console.log('Resp',response);
          response.forEach((item: any) => {
            this.configData[item.keyField] = item.keyValue;
          });
        },
        error: (error) => {
          console.log(error);
        }
      }
    );
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

  setValue(data: any){
    if(!data.id){
      // console.log('Test Values');
       data = {
      id:1,
      invoiceNumber: '2022/1',
      invoiceDate: '04/05/2024',
      soldTo: 'Sold Address',
      shipTo: 'Ship Address',
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

    this.ordersForm.patchValue({
      invoiceNumber: data.invoiceNumber,
      invoiceDate: new Date(data.invoiceDate),
      soldTo: data.soldTo,
      shipTo: data.shipTo,
      ourOrder: data.orderNumber,
      yourOrderNumber: data.custOrderNumber,
      deptNumber: data.deptNumber,
      shipVia: data.shipVia,
      terms: data.terms,
      salesman: data.salesman,
      frieghtDesc: data.frieightDescription,
      frieghtAmount: data.frieghtCharges,
      includeTaxes: data.taxRequired,
      taxDesc: data.taxDescription,
      taxValue: data.taxPercent,
      totalBoxes: data.boxes
    });

    this.setInvoiceLineItems(data.invoiceLineItems);
  }

  setInvoiceLineItems(lineItems: any[]) {
    const lineItemsArray = this.ordersForm.get('orders') as FormArray;
    lineItemsArray.clear();
    lineItems.forEach(item => {
      lineItemsArray.push(this.fb.group({
        id: [item.id],
        orderNumber: [item.styleNumber],
        description: [item.description],
        quantityOrdered: [item.quantityOrdered],
        quantityShipped: [item.quantityShipped],
        unitPrice: [item.unitPrice],
        amount: [item.amount]
      }));
    });
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

  // get totalItems(): number {
  //   const control = this.ordersForm.get('orders') as FormArray;
  //   let total = 0;
  //   control.controls.forEach((orderGroup) => {
  //     const amount = orderGroup.get('quantityShipped')?.value || 0;
  //     total += parseInt(amount);
  //   });
  //   return total;
  // }

  get taxAmount(): number {
    const control = this.ordersForm.get('orders') as FormArray;
    let total = 0;
    let frieghtAmount = 0;
    let taxAmount = 0;
    control.controls.forEach((orderGroup) => {
      const quantityShipped = orderGroup.get('quantityShipped')?.value || 0;
      const unitPrice = orderGroup.get('unitPrice')?.value || 0;
      const totalAmount = quantityShipped * unitPrice;
      total += totalAmount;
    });
    frieghtAmount = parseInt(this.ordersForm.get('frieghtAmount')?.value) || 0;
    total += frieghtAmount;
      if(this.includeTaxesControl?.value){
        const taxValue = this.ordersForm.get('taxValue')?.value || 0;
        taxAmount = ( taxValue / 100 ) * total;
      }
    return taxAmount;
  }

  get totalAmount(): number {
    const control = this.ordersForm.get('orders') as FormArray;
    let total = 0;
    let frieghtAmount = 0;
    let taxAmount = 0;
    control.controls.forEach((orderGroup) => {
      const quantityShipped = orderGroup.get('quantityShipped')?.value || 0;
      const unitPrice = orderGroup.get('unitPrice')?.value || 0;
      const totalAmount = quantityShipped * unitPrice;
      total += totalAmount;
    });
    frieghtAmount = parseInt(this.ordersForm.get('frieghtAmount')?.value) || 0;
    total += frieghtAmount;
      if(this.includeTaxesControl?.value){
        const taxValue = this.ordersForm.get('taxValue')?.value || 0;
        taxAmount = ( taxValue / 100 ) * total;
        total += taxAmount; 
      }
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

  createForm(){
    const formData = this.modifyInputData(this.ordersForm.value);
    if(!this.editMode){
      this.invoiceService.createInvoice(formData).subscribe(
        {
          next: (response) => {
            // console.log('Created successfully:', response);
            this.openSnackBar('Invoice Created');
            if(this.isPrint){
              this.printInvoice(response);
            }
          },
          error: (error: any) => {
          console.error('Error:', error);
           },
        }
      );
    }else {
      if(this.invoiceId){
        this.invoiceService.updateInvoice(formData, this.invoiceId).subscribe(
          {
            next: (response) => {
              // console.log('Updated successfully:', response);
              this.openSnackBar('Invoice Updated');
              if(this.isPrint){
                this.printInvoice(response);
              }
    
            },
            error: (error: any) => {
            console.error('Error:', error);
            // ****** Testing Purpouse
            // this.printInvoice(formData);
            //********
             },
          }
        );
      }
    }
  }

  modifyInputData(data:any){
    const invoiceLineItems = data.orders.map((order: any) => ({
      id: order.id,
      styleNumber: order.orderNumber,
      description: order.description,
      quantityOrdered: +order.quantityOrdered,
      quantityShipped: +order.quantityShipped,
      unitPrice: +order.unitPrice,
      amount: +(order.quantityShipped * order.unitPrice)
    }));
    return {
      id:this.invoiceId,
      invoiceNumber: data.invoiceNumber,
      invoiceDate: data.invoiceDate,
      soldTo: data.soldTo,
      shipTo: data.shipTo,
      orderNumber: data.ourOrder,
      custOrderNumber: data.yourOrderNumber,
      deptNumber: data.deptNumber,
      shipVia: data.shipVia,
      terms: data.terms,
      salesman: data.salesman,
      boxes: data.totalBoxes,
      taxRequired: this.includeTaxesControl?.value,
      taxPercent: +data.taxValue,
      taxDescription: data.taxDesc,
      frieghtCharges: +data.frieghtAmount,
      frieightDescription: data.frieghtDesc,
      totalPreTax: this.totalAmount-this.taxAmount,
      totalAfterTax: this.totalAmount+this.taxAmount,
      invoiceLineItems: invoiceLineItems
    };
  }

  printSave(){
    this.createForm();
    this.isPrint = true;
  }

  printInvoice(data: any){
    // data.id = 1;
    this.router.navigate(['/home/invoice-preview/'+ data?.id]);
  }

  openSnackBar(message: string) {
    this._snackBar.openFromComponent(SnackbarComponent, {
      data: { message: message},
      duration: 3000,
    });
  }

  generateRandomTwoDigitNumber(): number {
    // Generate a random number between 10 and 99 (inclusive)
    return Math.floor(Math.random() * 90) + 10;
  }
}