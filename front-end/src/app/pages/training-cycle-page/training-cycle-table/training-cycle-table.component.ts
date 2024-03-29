import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TrainingCycleService } from 'src/app/services/training-cycle.service';
import { ToastrService } from 'ngx-toastr';
import { TrainingCycleAddDialogComponent } from '../training-cycle-add-dialog/training-cycle-add-dialog.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Paginated } from 'src/app/share/types/paginate.type';
import { DeleteConfirmDialogComponent } from 'src/app/share/delete-confirm-dialog/delete-confirm-dialog.component';
import { TrainingData } from 'src/app/share/types/training-data.model.type';
import { TrainingCycle } from 'src/app/share/types/training-cycle.model.type';

@Component({
  selector: 'app-training-cycle-table',
  templateUrl: './training-cycle-table.component.html',
  styleUrls: ['./training-cycle-table.component.scss'],
})
export class TrainingCycleTableComponent {
  columnsToDisplay: string[] = ['id', 'text', 'creation_date', 'actions'];
  dataSource!: MatTableDataSource<TrainingCycle>;
  form!: FormGroup;
  response!: Paginated<TrainingCycle>;
  length = 0;
  pageSize = 50;
  pageIndex = 0;
  sortBy = 'text:ASC';
  text = '';
  constructor(
    public dialog: MatDialog,
    private trainingCycleService: TrainingCycleService,
    private toastr: ToastrService,
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

  async loadData() {
    const queryString = [];
    queryString.push(`limit=${this.pageSize}`);
    queryString.push(`page=${this.pageIndex + 1}`);
    queryString.push(`sortBy=${this.sortBy}`);
    queryString.push(`search=${this.text}`);

    this.trainingCycleService
      .find(queryString.join('&'))
      .subscribe((response) => {
        this.response = response;
        this.length = response.meta.totalItems;
        this.dataSource = new MatTableDataSource(response.data);
      });
  }

  openDialog(id: number = 0): void {
    const dialogRef = this.dialog.open(TrainingCycleAddDialogComponent, {
      data: { id: id },
      width: '100%',
      maxWidth: '650px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.submitted) this.loadData();
    });
  }

  handlePageEvent(e: PageEvent) {
    console.log(e);
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  delete(id: number) {
    this.dialog
      .open(DeleteConfirmDialogComponent, {
        data: {
          message: 'Are you sure you want to delete this record ?',
          title: 'Delete',
        },
      })
      .afterClosed()
      .subscribe(async (dialogResult) => {
        if (dialogResult == true) {
          await this.trainingCycleService.delete(id).subscribe({
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
