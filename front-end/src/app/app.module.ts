import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeleteConfirmDialogComponent } from './share/delete-confirm-dialog/delete-confirm-dialog.component';
import { TrainingCycleService } from './services/training-cycle.service';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { OrganizationsService } from './services/organizations.service';
import { PredictionsService } from './services/predictions.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommoditiesService } from './services/commodities.service';
import { TrainingDataService } from './services/training-data.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { H1Component } from './share/h1/h1.component';
import { ContentContainerComponent } from './share/content-container/content-container.component';
import { OrganizationInputComponent } from './share/organization-input/organization-input.component';
import { UploadFileMaterialComponent } from './share/upload-file-material/upload-file-material.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [AppComponent, HeaderComponent, FooterComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgSelectModule,
    ToastrModule.forRoot(),
    OrganizationInputComponent,
    UploadFileMaterialComponent,
    MatFormFieldModule,
    H1Component,
    ContentContainerComponent,
    DeleteConfirmDialogComponent,
    MatIconModule,
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
