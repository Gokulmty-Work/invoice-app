import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';

import { MaterialModule } from '../../material.module';
import { CreateInvoiceComponent } from './create-invoice/create-invoice.component';
import { DocsFormComponent } from './docs-form/docs-form.component';
import { DocsGenComponent } from './docs-gen/docs-gen.component';
import { GenListComponent } from './gen-list/gen-list.component';
import { DocGenerateRoutes } from './doc-generate.routing';
import { GenFileDownloadComponent } from './gen-file-download/gen-file-download.component';
import { NumbersOnlyDirective } from './directives/numbers-only.directive';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { InvoicePreviewComponent } from './invoice-preview/invoice-preview.component';
import { SnackbarComponent } from './snackbar/snackbar.component';

@NgModule({
  declarations: [
    CreateInvoiceComponent,
    DocsFormComponent,
    DocsGenComponent,
    GenListComponent,
    GenFileDownloadComponent,
    NumbersOnlyDirective,
    ConfirmationDialogComponent,
    InvoicePreviewComponent,
    SnackbarComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(DocGenerateRoutes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    DatePipe
  ]
})
export class DocGenerateModule { }
