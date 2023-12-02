import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommoditiesPageComponent } from './commodities-page.component';

const routes: Routes = [
  {
    path: '',
    component: CommoditiesPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommoditiesPageRoutingModule {}
