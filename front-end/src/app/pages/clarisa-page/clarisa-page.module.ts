import { NgModule } from '@angular/core';
import { ClarisaPageComponent } from './clarisa-page.component';
import { ClarisaTableComponent } from './clarisa-table/clarisa-table.component';
import { PagePaseModule } from '../page-pase.module';
import { ClarisaPageRoutingModule } from './clarisa-page-routing.module';

@NgModule({
  declarations: [ClarisaPageComponent, ClarisaTableComponent],
  imports: [PagePaseModule, ClarisaPageRoutingModule],
})
export class ClarisaPageModule {}
