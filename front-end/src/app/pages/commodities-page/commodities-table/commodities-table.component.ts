import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { DeleteConfirmDialogComponent } from 'src/app/share/delete-confirm-dialog/delete-confirm-dialog.component';
import {
  MediaService,
  UploadFileResponse,
} from 'src/app/services/media.service';
import { Paginated } from 'src/app/share/types/paginate.type';
import { TrainingData } from 'src/app/share/types/training-data.type';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommoditiesService } from 'src/app/services/commodities.service';
import { CommoditiesFormComponent } from '../commodities-form/commodities-form.component';

@Component({
  selector: 'app-commodities-table',
  templateUrl: './commodities-table.component.html',
  styleUrls: ['./commodities-table.component.scss'],
})
export class CommoditiesTableComponent {
  columnsToDisplay: string[] = ['id', 'name', 'parent_id', 'source', 'actions'];
  dataSource!: MatTableDataSource<any>;
  trainingData!: Paginated<TrainingData>;
  length = 0;
  pageSize = 50;
  pageIndex = 0;
  sortBy = 'id:ASC';
  text = '';
  organizations: any = [];
  form!: FormGroup;
  constructor(
    public dialog: MatDialog,
    private commoditiesService: CommoditiesService,
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
      sortBy: ['id:ASC'],
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

    this.commoditiesService
      .find(queryString.join('&'))
      .subscribe((response) => {
        this.trainingData = response;
        this.length = response.meta.totalItems;
        this.dataSource = new MatTableDataSource(response.data);
      });
  }

  openDialog(id?: number): void {
    const dialogRef = this.dialog.open(CommoditiesFormComponent, {
      data: { id },
      width: '100%',
      maxWidth: '650px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.submitted) this.loadData();
    });
  }

  fileUploaded(e: UploadFileResponse) {
    this.commoditiesService.processSheet(e.fileName).subscribe();
  }

  downloadFile() {
    this.mediaService.downloadFile('Commodities.xlsx', 'Commodities');
  }

  delete(id: number) {
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
          await this.commoditiesService.delete(id).subscribe({
            next: () => {
              this.loadData();
              this.toastr.success('Deleted successfully');
            },
            error: (error) => {
              this.toastr.error(error.error.message);
            },
          });
        }
      });
  }
}
