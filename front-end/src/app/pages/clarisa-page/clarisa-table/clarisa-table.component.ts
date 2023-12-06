import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Paginated } from 'src/app/share/types/paginate.type';
import { MatDialog } from '@angular/material/dialog';
import { OrganizationsService } from 'src/app/services/organizations.service';
import { Organization } from 'src/app/share/types/organization.model.type';

@Component({
  selector: 'app-clarisa-table',
  templateUrl: './clarisa-table.component.html',
  styleUrls: ['./clarisa-table.component.scss'],
})
export class ClarisaTableComponent {
  columnsToDisplay: string[] = ['id', 'name', 'acronym', 'code'];
  dataSource!: MatTableDataSource<Organization>;
  response!: Paginated<Organization>;
  length = 0;
  pageSize = 50;
  pageIndex = 0;
  sortBy = 'id:ASC';
  text = '';
  form!: FormGroup;
  constructor(
    public dialog: MatDialog,
    private organizationService: OrganizationsService,
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

    this.organizationService
      .find(queryString.join('&'))
      .subscribe((response) => {
        this.response = response;
        this.length = response.meta.totalItems;
        this.dataSource = new MatTableDataSource(response.data);
      });
  }
}
