import { NgModule } from '@angular/core';
import { TrainingDataPageRoutingModule } from './training-data-page-routing.module';
import { TrainingDataPageComponent } from './training-data-page.component';
import { TrainingDataTableComponent } from './training-data-table/training-data-table.component';
import { TrainingDataFormComponent } from './training-data-form/training-data-form.component';
import { PagePaseModule } from '../page-pase.module';
import { DeleteConfirmDialogModule } from 'src/app/share/delete-confirm-dialog/delete-confirm-dialog.module';

@NgModule({
  declarations: [
    TrainingDataPageComponent,
    TrainingDataTableComponent,
    TrainingDataFormComponent,
  ],
  exports: [TrainingDataFormComponent],
  imports: [
    PagePaseModule,
    TrainingDataPageRoutingModule,
    DeleteConfirmDialogModule,
  ],
})
export class TrainingDataPageModule {}
