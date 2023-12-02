import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClarisaPageComponent } from './clarisa-page.component';

const routes: Routes = [
  {
    path: '',
    component: ClarisaPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClarisaPageRoutingModule {}
