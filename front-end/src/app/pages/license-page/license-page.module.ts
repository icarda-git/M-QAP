import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LicensePageRoutingModule } from './license-page-routing.module';
import { LicensePageComponent } from './license-page.component';
import { PageContainerComponent } from 'src/app/share/page-container/page-container.component';
import { H1Component } from 'src/app/share/h1/h1.component';

@NgModule({
  declarations: [LicensePageComponent],
  imports: [
    CommonModule,
    LicensePageRoutingModule,
    PageContainerComponent,
    H1Component,
  ],
})
export class LicensePageModule {}
