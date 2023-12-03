import { NgModule } from '@angular/core';
import { CommoditiesPageRoutingModule } from './commodities-page-routing.module';
import { CommoditiesPageComponent } from './commodities-page.component';
import { CommoditiesTableComponent } from './commodities-table/commodities-table.component';
import { PagePaseModule } from '../page-pase.module';

@NgModule({
  declarations: [CommoditiesPageComponent, CommoditiesTableComponent],
  imports: [PagePaseModule, CommoditiesPageRoutingModule],
})
export class CommoditiesPageModule {}
