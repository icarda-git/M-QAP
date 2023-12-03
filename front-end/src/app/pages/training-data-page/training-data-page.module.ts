import { NgModule } from '@angular/core';
import { TrainingDataPageRoutingModule } from './training-data-page-routing.module';
import { TrainingDataPageComponent } from './training-data-page.component';
import { TrainingDataTableComponent } from './training-data-table/training-data-table.component';
import { TrainingDataAddDialogComponent } from './training-data-add-dialog/training-data-add-dialog.component';
import { PagePaseModule } from '../page-pase.module';
import { EditIconComponent } from 'src/app/share/edit-icon/edit-icon.component';
import { DeleteIconComponent } from 'src/app/share/delete-icon/delete-icon.component';
import { InputComponent } from 'src/app/share/input/input.component';
import { OrganizationInputComponent } from 'src/app/share/organization-input/organization-input.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DialogLayoutComponent } from 'src/app/share/dialog-layout/dialog-layout.component';

@NgModule({
  declarations: [
    TrainingDataPageComponent,
    TrainingDataTableComponent,
    TrainingDataAddDialogComponent,
  ],
  imports: [
    PagePaseModule,
    TrainingDataPageRoutingModule,
    EditIconComponent,
    DeleteIconComponent,
    InputComponent,
    OrganizationInputComponent,
    MatFormFieldModule,
    MatInputModule,
    DialogLayoutComponent
  ],
})
export class TrainingDataPageModule {}
