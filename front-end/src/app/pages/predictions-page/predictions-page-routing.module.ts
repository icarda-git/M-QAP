import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PredictionsPageComponent } from './predictions-page.component';

const routes: Routes = [
  {
    path: '',
    component: PredictionsPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PredictionsPageRoutingModule {}
