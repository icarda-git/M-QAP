import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UploadFileMaterialComponent } from './upload-file-material.component';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [UploadFileMaterialComponent],
  exports: [UploadFileMaterialComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
  ],
})
export class UploadFileMaterialModule {}
