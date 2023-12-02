import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home-page/home-page.module').then(
        (m) => m.HomePageModule
      ),
  },
  {
    path: 'training-data',
    loadChildren: () =>
      import('./pages/training-data-page/training-data-page.module').then(
        (m) => m.TrainingDataPageModule
      ),
  },
  {
    path: 'training-cycle',
    loadChildren: () =>
      import('./pages/training-cycle-page/training-cycle-page.module').then(
        (m) => m.TrainingCyclePageModule
      ),
  },
  {
    path: 'predictions',
    loadChildren: () =>
      import('./pages/predictions-page/predictions-page.module').then(
        (m) => m.PredictionsPageModule
      ),
  },
  {
    path: 'clarisa',
    loadChildren: () =>
      import('./pages/clarisa-page/clarisa-page.module').then(
        (m) => m.ClarisaPageModule
      ),
  },
  {
    path: 'commodities',
    loadChildren: () =>
      import('./pages/commodities-page/commodities-page.module').then(
        (m) => m.CommoditiesPageModule
      ),
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
