import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrainingDataPageComponent } from './training-data-page.component';

const routes: Routes = [
  {
    path: '',
    component: TrainingDataPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrainingDataPageRoutingModule {}
