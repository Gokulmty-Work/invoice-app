import { Routes } from '@angular/router';
import { UnSavedChangesGuard } from 'src/app/guards/can-deactivate.guard';
import { GenListComponent } from './gen-list/gen-list.component';
import { InvoicePreviewComponent } from './invoice-preview/invoice-preview.component';
import { UploadDocsComponent } from './upload-docs/upload-docs.component';

// ui
// import { AppBadgeComponent } from './badge/badge.component';
// import { AppChipsComponent } from './chips/chips.component';
// import { AppListsComponent } from './lists/lists.component';
// import { AppMenuComponent } from './menu/menu.component';
// import { AppTooltipsComponent } from './tooltips/tooltips.component';

export const DocGenerateRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        component: GenListComponent,
      },
      {
        path: 'add-new',
        component: UploadDocsComponent,
        // canDeactivate: [UnSavedChangesGuard]
      },
      { 
        path: 'add-new/:id', 
        component: UploadDocsComponent 
      },
      {
        path: 'invoice-preview/:id',
        component: InvoicePreviewComponent,
      },
    //   {
    //     path: 'lists',
    //     component: AppListsComponent,
    //   },
    //   {
    //     path: 'menu',
    //     component: AppMenuComponent,
    //   },
    //   {
    //     path: 'tooltips',
    //     component: AppTooltipsComponent,
    //   },
    ],
  },
];
