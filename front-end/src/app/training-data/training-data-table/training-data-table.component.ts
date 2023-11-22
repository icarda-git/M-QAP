import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TrainingDataAddDialogComponent } from './training-data-add-dialog/training-data-add-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmDialogComponent } from 'src/app/delete-confirm-dialog/delete-confirm-dialog.component';
import { HeaderServiceService } from 'src/app/header-service.service';

export interface TrainingData {
  text: string;
  id: number;
  clarisaName: string;
  clarisaAcronym: string;
  source: string;
}

@Component({
  selector: 'app-training-data-table',
  templateUrl: './training-data-table.component.html',
  styleUrls: ['./training-data-table.component.scss'],
})
export class TrainingDataTableComponent {
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(
    public dialog: MatDialog,
    public headerService: HeaderServiceService
  ) {
    this.headerService.background =
      'linear-gradient(to right, #04030F, #04030F)';
    this.headerService.backgroundNavMain =
      'linear-gradient(to right, #2A2E45, #212537)';
    this.headerService.backgroundUserNavButton =
      'linear-gradient(to right, #2A2E45, #212537)';

    this.headerService.backgroundFooter =
      'linear-gradient(to top right, #2A2E45, #212537)';
    this.headerService.backgroundDeleteYes = '#5569dd';
    this.headerService.backgroundDeleteClose = '#808080';
    this.headerService.backgroundDeleteLr = '#5569dd';
  }

  ELEMENT_DATA: TrainingData[] = [
    {
      id: 1,
      text: 'Scaling impact, Operations, Legal, Funding, Partners and Partnerships	',
      clarisaName: 'aewwwe',
      clarisaAcronym: 'H',
      source: 'aew',
    },
    {
      id: 2,
      text: 'Hydrogen',
      clarisaName: 'aewwwe',
      clarisaAcronym: 'H',
      source: 'aew',
    },
    {
      id: 3,
      text: 'Hydrogen',
      clarisaName: 'aewwwe',
      clarisaAcronym: 'H',
      source: 'aew',
    },
    {
      id: 4,
      text: 'Hydrogen',
      clarisaName: 'aewwwe',
      clarisaAcronym: 'H',
      source: 'aew',
    },
    {
      id: 5,
      text: 'Hydrogen',
      clarisaName: 'aewwwe',
      clarisaAcronym: 'H',
      source: 'aew',
    },
    {
      id: 6,
      text: 'Hydrogen',
      clarisaName: 'aewwwe',
      clarisaAcronym: 'H',
      source: 'aew',
    },
    {
      id: 7,
      text: 'Hydrogen',
      clarisaName: 'aewwwe',
      clarisaAcronym: 'H',
      source: 'aew',
    },
    {
      id: 8,
      text: 'Hydrogen',
      clarisaName: 'aewwwe',
      clarisaAcronym: 'H',
      source: 'aew',
    },
  ];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  displayedColumns: string[] = [
    'id',
    'text',
    'clarisaName',
    'clarisaAcronym',
    'source',
    'action',
  ];
  dataSource = new MatTableDataSource<TrainingData>(this.ELEMENT_DATA);

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openNewTrainingDataDialog(title: any, element: any = null) {
    this.dialog.open(TrainingDataAddDialogComponent, {
      data: {
        id: 'add',
        title: title,
        element: element,
      },
    });
  }

  openDialogEditTrainingData(title: any, element: any) {
    this.dialog.open(TrainingDataAddDialogComponent, {
      data: {
        id: 'edit',
        title: title,
        element: element,
      },
    });
  }

  //deleteTrainingDataById

  async deleteTrainingDataById(id: any) {
    this.dialog
      .open(DeleteConfirmDialogComponent, {
        data: {
          message: 'Are you sure you want to delete this record ?',
          title: 'Delete',

          svg: `../../../../assets/shared-image/delete-user.png`,
        },
      })
      .afterClosed();
  }
}
