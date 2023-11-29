import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ToastrService } from "ngx-toastr";
import { TrainningDataService } from "src/app/services/trainning-data.service";
import { TrainingDataAddDialogComponent } from "./training-data-add-dialog/training-data-add-dialog.component";
import { DeleteConfirmDialogComponent } from "src/app/delete-confirm-dialog/delete-confirm-dialog.component";

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
  columnsToDisplay: string[] = ["id", "text","name","acronym","source", "actions"];
  dataSource!: MatTableDataSource<any>;
  TrainningData: any = [];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  organizations: any = [];

  constructor(public dialog: MatDialog, private trainningDataService: TrainningDataService,private toastr: ToastrService,) {}





 
  ngOnInit() {
   
    this.initTable();

  
    
  }


 











  async initTable() {
    this.TrainningData = await this.trainningDataService.getAllTrainningData();
    this.dataSource = new MatTableDataSource(this.TrainningData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
      console.log(this.TrainningData)
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
    
  }




  // ngAfterViewInit() {
  //   this.dataSource.paginator = this.paginator;
  //   this.dataSource.sort = this.sort;
  // }

  openDialog(id: number = 0): void {
    const dialogRef = this.dialog.open(TrainingDataAddDialogComponent, {
      data: { id: id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.submitted) this.initTable();
    });
  }

  //deleteTrainingCycleById

  // async deleteTrainingCycleById(id: number) {
  //   this.dialog
  //     .open(DeleteConfirmDialogComponent, {
  //       data: {
  //         message: 'Are you sure you want to delete this record ?',
  //         title: 'Delete',

  //         svg: `../../../../assets/shared-image/delete-user.png`,
  //       },
  //     }) 
  //     .afterClosed();
  //     .subscribe(async (dialogResult) => {
  //       if (dialogResult == true) {
  //         await this.trainningCycleService.deleteTrainningCycle(id).then(
  //           (data) => {
  //             this.initTable();
  //             this.toastr.success("Deleted successfully");
  //           },
  //           (error) => {
  //             this.toastr.error(error.error.message);
  //           }
  //         );
  //       }
  //     });
  // }



  deleteTrainingDataById(id: number) {
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
          await this.trainningDataService.deleteTrainningData(id).then(
            (data) => {
              this.initTable();
              this.toastr.success("Deleted successfully");
            },
            (error) => {
              this.toastr.error(error.error.message);
            }
          );
        }
      });
  }




}