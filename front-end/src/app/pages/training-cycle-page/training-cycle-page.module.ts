import { NgModule } from '@angular/core';
import { TrainingCyclePageRoutingModule } from './training-cycle-page-routing.module';
import { TrainingCyclePageComponent } from './training-cycle-page.component';
import { TrainingCycleTableComponent } from './training-cycle-table/training-cycle-table.component';
import { TrainingCycleAddDialogComponent } from './training-cycle-table/training-cycle-add-dialog/training-cycle-add-dialog.component';
import { PagePaseModule } from '../page-pase.module';

@NgModule({
  declarations: [
    TrainingCyclePageComponent,
    TrainingCycleTableComponent,
    TrainingCycleAddDialogComponent,
  ],
  imports: [PagePaseModule, TrainingCyclePageRoutingModule],
})
export class TrainingCyclePageModule {}
