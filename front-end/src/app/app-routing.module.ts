import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TrainingDataComponent } from './training-data/training-data.component';
import { TrainingCycleComponent } from './training-cycle/training-cycle.component';
import { PredictionsComponent } from './predictions/predictions.component';
import { ClarisaComponent } from './clarisa/clarisa.component';
import { TrainingDataOverviewComponent } from './training-data/training-data-overview/training-data-overview.component';
import { TrainingCycleOverviewComponent } from './training-cycle/training-cycle-overview/training-cycle-overview.component';
import { PredictionsOverviewComponent } from './predictions/predictions-overview/predictions-overview.component';
import { ClarisaOverviewComponent } from './clarisa/clarisa-overview/clarisa-overview.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  { path: 'home', component: HomeComponent },
  {
    path: 'training-data',
    component: TrainingDataComponent,
    children: [
      {
        path: '',
        component: TrainingDataOverviewComponent,
      },
    ],
  },
  {
    path: 'training-cycle',
    component: TrainingCycleComponent,
    children: [
      {
        path: '',
        component: TrainingCycleOverviewComponent,
      },
    ],
  },
  {
    path: 'predictions',
    component: PredictionsComponent,
    children: [
      {
        path: '',
        component: PredictionsOverviewComponent,
      },
    ],
  },
  {
    path: 'clarisa',
    component: ClarisaComponent,
    children: [
      {
        path: '',
        component: ClarisaOverviewComponent,
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
