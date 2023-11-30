import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';

export type UploadFileResponse = {
  fileName: string;
};

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  constructor(private httpService: HttpClient) {}

  getURL(route: string) {
    return `http://localhost:3000` + route;
  }

  upload(formData: FormData) {
    return this.httpService.post<UploadFileResponse>(
      this.getURL('/media'),
      formData,
      {
        headers: {},
      }
    );
  }

  download(id: string) {
    return this.httpService.get(this.getURL(`/media/file/${id}`));
  }

  downloadFileFromLink(url: string, name: string) {
    saveAs(this.getURL(url), name);
  }

  downloadFile(file: any, text: string) {
    saveAs(
      this.getURL(`/media/file/${file}`),
      [text, '.', file.split('.').pop()].join('')
    );
  }
}
