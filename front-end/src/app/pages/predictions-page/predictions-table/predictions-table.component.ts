import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Paginated } from 'src/app/share/types/paginate.type';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { PredictionsService } from 'src/app/services/predictions.service';

@Component({
  selector: 'app-predictions-table',
  templateUrl: './predictions-table.component.html',
  styleUrls: ['./predictions-table.component.scss'],
})
export class PredictionsTableComponent {
  columnsToDisplay: string[] = [
    'id',
    'text',
    'name',
    'acronym',
    'confidant',
    'cycle',
  ];
  dataSource!: MatTableDataSource<any>;
  trainingData!: Paginated<any>;
  length = 0;
  pageSize = 50;
  pageIndex = 0;
  sortBy = 'text:ASC';
  text = '';
  organizations: any = [];
  form!: FormGroup;
  constructor(
    public dialog: MatDialog,
    private predictionsService: PredictionsService,
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

    this.predictionsService
      .find(queryString.join('&'))
      .subscribe((response) => {
        this.trainingData = response;
        this.length = response.meta.totalItems;
        this.dataSource = new MatTableDataSource(response.data);
      });
  }
}
