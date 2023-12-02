import { NgModule } from '@angular/core';
import { PredictionsPageRoutingModule } from './predictions-page-routing.module';
import { PredictionsPageComponent } from './predictions-page.component';
import { PredictionsTableComponent } from './predictions-table/predictions-table.component';
import { PagePaseModule } from '../page-pase.module';

@NgModule({
  declarations: [PredictionsPageComponent, PredictionsTableComponent],
  imports: [PagePaseModule, PredictionsPageRoutingModule],
})
export class PredictionsPageModule {}
