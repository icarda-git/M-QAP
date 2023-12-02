import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TrainingCycleService } from 'src/app/services/training-cycle.service';
import { ToastrService } from 'ngx-toastr';
import { DeleteConfirmDialogComponent } from 'src/app/share/delete-confirm-dialog/delete-confirm-dialog.component';
import { TrainingCycleAddDialogComponent } from './training-cycle-add-dialog/training-cycle-add-dialog.component';

@Component({
  selector: 'app-training-cycle-table',
  templateUrl: './training-cycle-table.component.html',
  styleUrls: ['./training-cycle-table.component.scss'],
})
export class TrainingCycleTableComponent {
  columnsToDisplay: string[] = ['id', 'text', 'createdDate', 'actions'];
  dataSource!: MatTableDataSource<any>;
  allTrainingCycle: any = [];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(
    public dialog: MatDialog,
    private trainingCycleService: TrainingCycleService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.initTable();
  }

  async initTable() {
    this.allTrainingCycle =
      await this.trainingCycleService.getAllTrainingCycle();
    this.dataSource = new MatTableDataSource(this.allTrainingCycle);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    console.log(this.allTrainingCycle);
  }

  openDialog(id: number = 0): void {
    const dialogRef = this.dialog.open(TrainingCycleAddDialogComponent, {
      data: { id: id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.submitted) this.initTable();
    });
  }

  deleteTrainingCycleById(id: number) {
    this.dialog
      .open(DeleteConfirmDialogComponent, {
        data: {
          message: 'Are you sure you want to delete this record ?',
          title: 'Delete',

          svg: `../../../../assets/shared-image/delete-user.png`,
        },
      })
      .afterClosed()
      .subscribe(async (dialogResult) => {
        if (dialogResult == true) {
          await this.trainingCycleService.deleteTrainingCycle(id).then(
            (data) => {
              this.initTable();
              this.toastr.success('Deleted successfully');
            },
            (error) => {
              this.toastr.error(error.error.message);
            }
          );
        }
      });
  }
}
