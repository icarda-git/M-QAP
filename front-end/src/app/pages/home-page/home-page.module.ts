import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomePageRoutingModule } from './home-page-routing.module';
import { HomePageComponent } from './home-page.component';
import { H1Component } from 'src/app/share/h1/h1.component';
import { ContentContainerComponent } from 'src/app/share/content-container/content-container.component';

@NgModule({
  declarations: [HomePageComponent],
  imports: [
    CommonModule,
    HomePageRoutingModule,
    H1Component,
    ContentContainerComponent,
  ],
})
export class HomePageModule {}
