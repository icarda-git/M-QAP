import { NgModule } from '@angular/core';
import { CommoditiesPageRoutingModule } from './commodities-page-routing.module';
import { CommoditiesPageComponent } from './commodities-page.component';
import { CommoditiesTableComponent } from './commodities-table/commodities-table.component';
import { PagePaseModule } from '../page-pase.module';
import { CommoditiesFormComponent } from './commodities-form/commodities-form.component';
import { CommodityInputComponent } from 'src/app/share/commodity-input/commodity-input.component';

@NgModule({
  declarations: [
    CommoditiesPageComponent,
    CommoditiesTableComponent,
    CommoditiesFormComponent,
  ],
  imports: [
    PagePaseModule,
    CommoditiesPageRoutingModule,
    CommodityInputComponent,
  ],
})
export class CommoditiesPageModule {}
