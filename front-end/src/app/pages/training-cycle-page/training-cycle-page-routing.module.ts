import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrainingCyclePageComponent } from './training-cycle-page.component';

const routes: Routes = [{
  path: '',
  component: TrainingCyclePageComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrainingCyclePageRoutingModule { }
