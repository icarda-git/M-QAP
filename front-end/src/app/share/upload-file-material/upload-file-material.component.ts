import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  MediaService,
  UploadFileResponse,
} from 'src/app/services/media.service';
import { environment } from 'src/environments/environment';

export const FileExtension = {
  word: '.doc, .docx',
  xcel: '.xlsx,.xls',
  powerpoint: '.ppt, .pptx',
  pdf: '.pdf',
};

@Component({
  selector: 'app-upload-file-material',
  templateUrl: './upload-file-material.component.html',
  styleUrls: ['./upload-file-material.component.scss'],
  standalone: true,
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
export class UploadFileMaterialComponent {
  @Output() uploaded = new EventEmitter<UploadFileResponse>();
  @Input() form!: FormGroup;
  @Input() controller!: string;
  @Input() type!: string;
  @Input() label!: string;
  environment = environment;
  accept = [FileExtension.xcel].join(', ');
  constructor(private mediaService: MediaService) {}

  fileSelected(input: any) {
    const { files } = input.srcElement;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append(`file-${i}`, files[i], files[i].name);
    }

    this.mediaService.upload(formData).subscribe((file) => {
      this.uploaded.emit(file);
      input.srcElement.value = '';
    });
  }
}
