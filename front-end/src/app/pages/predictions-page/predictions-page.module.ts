import { NgModule } from '@angular/core';
import { PredictionsPageRoutingModule } from './predictions-page-routing.module';
import { PredictionsPageComponent } from './predictions-page.component';
import { PredictionsTableComponent } from './predictions-table/predictions-table.component';
import { PagePaseModule } from '../page-pase.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DeleteIconComponent } from 'src/app/share/delete-icon/delete-icon.component';
import { DialogLayoutComponent } from 'src/app/share/dialog-layout/dialog-layout.component';
import { EditIconComponent } from 'src/app/share/edit-icon/edit-icon.component';
import { InputComponent } from 'src/app/share/input/input.component';
import { OrganizationInputComponent } from 'src/app/share/organization-input/organization-input.component';

@NgModule({
  declarations: [PredictionsPageComponent, PredictionsTableComponent],
  imports: [
    PagePaseModule,
    PredictionsPageRoutingModule,
    EditIconComponent,
    DeleteIconComponent,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    InputComponent,
    OrganizationInputComponent,
    MatFormFieldModule,
    MatInputModule,
    DialogLayoutComponent,
  ],
})
export class PredictionsPageModule {}
