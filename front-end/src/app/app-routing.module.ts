import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TrainingDataComponent } from './training-data/training-data.component';
import { TrainingCycleComponent } from './training-cycle/training-cycle.component';
import { PredictionsComponent } from './predictions/predictions.component';
import { ClarisaComponent } from './clarisa/clarisa.component';
import { TrainingCycleOverviewComponent } from './training-cycle/training-cycle-overview/training-cycle-overview.component';
import { PredictionsOverviewComponent } from './predictions/predictions-overview/predictions-overview.component';
import { ClarisaOverviewComponent } from './clarisa/clarisa-overview/clarisa-overview.component';
import { CommoditiesComponent } from './commodities/commodities.component';
import { CommoditiesOverviewComponent } from './commodities/commodities-overview/commodities-overview.component';

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

  {
    path: 'commodities',
    component: CommoditiesComponent,
    children: [
      {
        path: '',
        component: CommoditiesOverviewComponent,
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
