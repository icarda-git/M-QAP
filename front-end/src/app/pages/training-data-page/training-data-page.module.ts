import { NgModule } from '@angular/core';
import { TrainingDataPageRoutingModule } from './training-data-page-routing.module';
import { TrainingDataPageComponent } from './training-data-page.component';
import { TrainingDataTableComponent } from './training-data-table/training-data-table.component';
import { TrainingDataAddDialogComponent } from './training-data-table/training-data-add-dialog/training-data-add-dialog.component';
import { PagePaseModule } from '../page-pase.module';

@NgModule({
  declarations: [
    TrainingDataPageComponent,
    TrainingDataTableComponent,
    TrainingDataAddDialogComponent,
  ],
  imports: [PagePaseModule, TrainingDataPageRoutingModule],
})
export class TrainingDataPageModule {}
