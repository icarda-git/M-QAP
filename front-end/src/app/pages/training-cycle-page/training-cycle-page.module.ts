import { NgModule } from '@angular/core';
import { TrainingCyclePageRoutingModule } from './training-cycle-page-routing.module';
import { TrainingCyclePageComponent } from './training-cycle-page.component';
import { TrainingCycleTableComponent } from './training-cycle-table/training-cycle-table.component';
import { TrainingCycleAddDialogComponent } from './training-cycle-add-dialog/training-cycle-add-dialog.component';
import { PagePaseModule } from '../page-pase.module';
import { DialogLayoutComponent } from 'src/app/share/dialog-layout/dialog-layout.component';
import { InputComponent } from 'src/app/share/input/input.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DeleteIconComponent } from 'src/app/share/delete-icon/delete-icon.component';
import { EditIconComponent } from 'src/app/share/edit-icon/edit-icon.component';
import { OrganizationInputComponent } from 'src/app/share/organization-input/organization-input.component';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    TrainingCyclePageComponent,
    TrainingCycleTableComponent,
    TrainingCycleAddDialogComponent,
  ],
  imports: [
    PagePaseModule,
    TrainingCyclePageRoutingModule,
    EditIconComponent,
    DeleteIconComponent,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    InputComponent,
    OrganizationInputComponent,
    MatFormFieldModule,
    MatInputModule,
    DialogLayoutComponent
  ],
})
export class TrainingCyclePageModule {}
