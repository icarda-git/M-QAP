import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationInputComponent } from './organization-input.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [OrganizationInputComponent],
  exports: [OrganizationInputComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    NgSelectModule,
    FormsModule,
    MatTooltipModule,
    MatIconModule
  ],
})
export class OrganizationInputModule {}
