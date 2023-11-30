import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { TrainingDataComponent } from './training-data/training-data.component';
import { TrainingCycleComponent } from './training-cycle/training-cycle.component';
import { PredictionsComponent } from './predictions/predictions.component';
import { ClarisaComponent } from './clarisa/clarisa.component';
import { TrainingDataTableComponent } from './training-data/training-data-table/training-data-table.component';
import { TrainingDataAddDialogComponent } from './training-data/training-data-table/training-data-add-dialog/training-data-add-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TrainingCycleTableComponent } from './training-cycle/training-cycle-table/training-cycle-table.component';
import { TrainingCycleAddDialogComponent } from './training-cycle/training-cycle-table/training-cycle-add-dialog/training-cycle-add-dialog.component';
import { TrainingCycleOverviewComponent } from './training-cycle/training-cycle-overview/training-cycle-overview.component';
import { SearchTrainingCycleComponent } from './training-cycle/search-training-cycle/search-training-cycle.component';
import { PredictionsTableComponent } from './predictions/predictions-table/predictions-table.component';
import { PredictionsOverviewComponent } from './predictions/predictions-overview/predictions-overview.component';
import { DeleteConfirmDialogComponent } from './delete-confirm-dialog/delete-confirm-dialog.component';
import { ClarisaOverviewComponent } from './clarisa/clarisa-overview/clarisa-overview.component';
import { ClarisaTableComponent } from './clarisa/clarisa-table/clarisa-table.component';
import { TrainingCycleService } from './services/trainning-cycle.service';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { OrganizationsService } from './services/organizations.service';
import { PredictionsService } from './services/predictions.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommoditiesComponent } from './commodities/commodities.component';
import { CommoditiesOverviewComponent } from './commodities/commodities-overview/commodities-overview.component';
import { CommoditiesTableComponent } from './commodities/commodities-table/commodities-table.component';
import { CommoditiesService } from './services/commodities.service';
import { TrainingDataService } from './services/training-data.service';
import { OrganizationInputModule } from './share/organization-input/organization-input.module';
import { UploadFileMaterialModule } from './share/upload-file-material/upload-file-material.module';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    TrainingDataComponent,
    TrainingCycleComponent,
    PredictionsComponent,
    ClarisaComponent,
    TrainingDataTableComponent,
    TrainingDataAddDialogComponent,
    TrainingCycleTableComponent,
    TrainingCycleAddDialogComponent,
    TrainingCycleOverviewComponent,
    SearchTrainingCycleComponent,
    PredictionsTableComponent,
    PredictionsOverviewComponent,
    DeleteConfirmDialogComponent,
    ClarisaOverviewComponent,
    ClarisaTableComponent,
    CommoditiesComponent,
    CommoditiesOverviewComponent,
    CommoditiesTableComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgSelectModule,
    ToastrModule.forRoot(),
    OrganizationInputModule,
    UploadFileMaterialModule,
    MatFormFieldModule,
  ],
  providers: [
    TrainingCycleService,
    OrganizationsService,
    PredictionsService,
    TrainingDataService,
    CommoditiesService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
