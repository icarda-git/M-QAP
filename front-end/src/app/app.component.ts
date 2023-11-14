import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor() {
    const faviconTag: any = document.getElementById('faviconTag');

    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      faviconTag.href = '/assets/shared-image/mask-group.svg';
    } else faviconTag.href = '/assets/shared-image/cgiar-logo.png';
  }
}
