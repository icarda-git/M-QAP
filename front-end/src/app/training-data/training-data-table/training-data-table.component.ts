import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TrainingDataAddDialogComponent } from './training-data-add-dialog/training-data-add-dialog.component';
import { MatDialog } from '@angular/material/dialog';

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

  constructor(public dialog: MatDialog) {}

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
        title: title,
        element: element,
      },
    });
  }

  openDialogEditTrainingData(title: any, element: any) {
    this.dialog.open(TrainingDataAddDialogComponent, {
      data: {
        title: title,
        element: element,
      },
    });
  }

  //Delete-User-By-Id

  async deleteUserById(id: any) {
    // this.dialog
    // .open(DeleteConfirmDialogComponent, {
    //   maxWidth: '400px',
    //   data: {
    //     message : 'Are you sure you want to delete this record ?'
    //   }
    // }).afterClosed()
    // .subscribe(async (res) => {
    //   if(res == true) {
    //     const result =  await this.users.deleteUser(id);
    //     if(result) {
    //       this.toastr.success(
    //         'Success deleted'
    //       );
    //     }
    //     else {
    //       this.toastr.error(
    //         'can not deleted'
    //       );
    //     }
    //   }
    //   await this.init();
    // });
  }
}
