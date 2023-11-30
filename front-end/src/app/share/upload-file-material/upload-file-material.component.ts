import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
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
    });
  }
}
