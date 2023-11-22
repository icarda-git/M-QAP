import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { MatDialog } from '@angular/material/dialog';

import { TrainingCycleAddDialogComponent } from './training-cycle-add-dialog/training-cycle-add-dialog.component';
import { DeleteConfirmDialogComponent } from 'src/app/delete-confirm-dialog/delete-confirm-dialog.component';

export interface TrainingCycle {
  id: number;
  name: string;
  createdDate: string;
}

@Component({
  selector: 'app-training-cycle-table',
  templateUrl: './training-cycle-table.component.html',
  styleUrls: ['./training-cycle-table.component.scss'],
})
export class TrainingCycleTableComponent {
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(public dialog: MatDialog) {}

  ELEMENT_DATA: TrainingCycle[] = [
    {
      id: 1,
      name: 'Scaling impact, Operations, Legal, Funding, Partners and Partnerships	',
      createdDate: '26/10/2023',
    },
    {
      id: 2,
      name: 'Scaling impact, Operations, Legal, Funding, Partners and Partnerships	',
      createdDate: '26/10/2023',
    },
    {
      id: 3,
      name: 'Scaling impact, Operations, Legal, Funding, Partners and Partnerships	',
      createdDate: '26/10/2023',
    },
    {
      id: 4,
      name: 'Scaling impact, Operations, Legal, Funding, Partners and Partnerships	',
      createdDate: '26/10/2023',
    },
    {
      id: 5,
      name: 'Scaling impact, Operations, Legal, Funding, Partners and Partnerships	',
      createdDate: '26/10/2023',
    },
  ];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  displayedColumns: string[] = ['id', 'name', 'createdDate', 'action'];
  dataSource = new MatTableDataSource<TrainingCycle>(this.ELEMENT_DATA);

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openNewTrainingCycleDialog(title: any, element: any = null) {
    this.dialog.open(TrainingCycleAddDialogComponent, {
      data: {
        id: 'add',
        title: title,
        element: element,
      },
    });
  }

  openDialogEditTrainingCycle(title: any, element: any) {
    this.dialog.open(TrainingCycleAddDialogComponent, {
      data: {
        id: 'edit',
        title: title,
        element: element,
      },
    });
  }

  //deleteTrainingCycleById

  async deleteTrainingCycleById(id: any) {
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
