import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '../../material.module';
import { ProfileComponent } from './profile/profile.component';
import { ConfigComponent } from './config/config.component';
import { ConfigurationRoutes } from './configuration.routing';

@NgModule({
  declarations: [
    ProfileComponent,
    ConfigComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ConfigurationRoutes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class ConfigurationModule { }
