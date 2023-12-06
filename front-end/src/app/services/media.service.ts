import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { environment } from 'src/environments/environment';

export type UploadFileResponse = {
  fileName: string;
};

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  private api: string = `${environment.api_url}/media`;

  constructor(private httpService: HttpClient) {}

  upload(formData: FormData) {
    return this.httpService.post<UploadFileResponse>(this.api, formData, {
      headers: {},
    });
  }

  download(id: string) {
    return this.httpService.get(`${this.api}/file/${id}`);
  }

  downloadFileFromLink(url: string, name: string) {
    saveAs(`${this.api}/${url}`, name);
  }

  downloadFile(file: string, text: string) {
    saveAs(
      `${this.api}/file/${file}`,
      [text, '.', file.split('.').pop()].join('')
    );
  }
}
