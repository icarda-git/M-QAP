import { NgModule } from '@angular/core';
import { PredictionsPageRoutingModule } from './predictions-page-routing.module';
import { PredictionsPageComponent } from './predictions-page.component';
import { PredictionsTableComponent } from './predictions-table/predictions-table.component';
import { PagePaseModule } from '../page-pase.module';
import { DialogLayoutComponent } from 'src/app/share/dialog-layout/dialog-layout.component';
import { TrainingDataPageModule } from '../training-data-page/training-data-page.module';

@NgModule({
  declarations: [PredictionsPageComponent, PredictionsTableComponent],
  imports: [
    PagePaseModule,
    PredictionsPageRoutingModule,
    DialogLayoutComponent,
    TrainingDataPageModule
  ],
})
export class PredictionsPageModule {}
