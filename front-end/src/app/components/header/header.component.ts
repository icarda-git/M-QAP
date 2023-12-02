import { Component } from '@angular/core';
import { HeaderServiceService } from '../../header-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(public headerService: HeaderServiceService) {
    this.headerService.setBackground('#0f212f');
  }
}
