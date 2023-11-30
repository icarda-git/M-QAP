import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { TrainingDataService } from 'src/app/services/training-data.service';
import { TrainingDataAddDialogComponent } from './training-data-add-dialog/training-data-add-dialog.component';
import { DeleteConfirmDialogComponent } from 'src/app/delete-confirm-dialog/delete-confirm-dialog.component';
import {
  MediaService,
  UploadFileResponse,
} from 'src/app/services/media.service';
import { Paginated } from 'src/app/share/types/paginate.type';
import { TrainingData } from 'src/app/share/types/training-data.type';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-training-data-table',
  templateUrl: './training-data-table.component.html',
  styleUrls: ['./training-data-table.component.scss'],
})
export class TrainingDataTableComponent {
  columnsToDisplay: string[] = [
    'id',
    'text',
    'name',
    'acronym',
    'source',
    'actions',
  ];
  dataSource!: MatTableDataSource<any>;
  trainingData!: Paginated<TrainingData>;
  length = 0;
  pageSize = 50;
  pageIndex = 0;
  sortBy = 'text:ASC';
  text = '';
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  organizations: any = [];
  form!: FormGroup;
  constructor(
    public dialog: MatDialog,
    private trainingDataService: TrainingDataService,
    private toastr: ToastrService,
    private mediaService: MediaService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadData();
  }

  initForm() {
    this.form = this.fb.group({
      text: [''],
      sortBy: ['text:ASC'],
    });
    this.form.valueChanges.subscribe((value) => {
      this.text = value.text;
      this.sortBy = value.sortBy;
      this.loadData();
    });
  }

  handlePageEvent(e: PageEvent) {
    console.log(e);
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async loadData() {
    const queryString = [];
    queryString.push(`limit=${this.pageSize}`);
    queryString.push(`page=${this.pageIndex + 1}`);
    queryString.push(`sortBy=${this.sortBy}`);
    queryString.push(`search=${this.text}`);

    this.trainingDataService
      .getAllTrainingData(queryString.join('&'))
      .subscribe((response) => {
        this.trainingData = response;
        this.length = response.meta.totalItems;
        this.dataSource = new MatTableDataSource(response.data);
      });
  }

  openDialog(id?: number): void {
    const dialogRef = this.dialog.open(TrainingDataAddDialogComponent, {
      data: { id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.submitted) this.loadData();
    });
  }

  fileUploaded(e: UploadFileResponse) {
    this.trainingDataService.processSheet(e.fileName).subscribe();
  }

  downloadFile() {
    this.mediaService.downloadFile(
      'Matched_partners_PRMS.xlsx',
      'Matched_partners_PRMS'
    );
  }

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
          await this.trainingDataService.deleteTrainingData(id).then(
            (data) => {
              this.loadData();
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
