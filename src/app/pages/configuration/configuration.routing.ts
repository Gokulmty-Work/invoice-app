import { Routes } from '@angular/router';
import { UnSavedChangesGuard } from 'src/app/guards/can-deactivate.guard';

import { ProfileComponent } from './profile/profile.component';
import { ConfigComponent } from './config/config.component';



export const ConfigurationRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'config',
        component: ConfigComponent,
      },
    ],
  },
];
