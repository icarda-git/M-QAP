import { NgModule } from '@angular/core';
import { TrainingDataPageRoutingModule } from './training-data-page-routing.module';
import { TrainingDataPageComponent } from './training-data-page.component';
import { TrainingDataTableComponent } from './training-data-table/training-data-table.component';
import { TrainingDataFormComponent } from './training-data-form/training-data-form.component';
import { PagePaseModule } from '../page-pase.module';

@NgModule({
  declarations: [
    TrainingDataPageComponent,
    TrainingDataTableComponent,
    TrainingDataFormComponent,
  ],
  imports: [PagePaseModule, TrainingDataPageRoutingModule],
})
export class TrainingDataPageModule {}
