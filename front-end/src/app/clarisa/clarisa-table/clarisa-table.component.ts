import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

export interface Clarisa {
  id: number;
  clarisaName: string;
  clarisaAcronym: string;
}
@Component({
  selector: 'app-clarisa-table',
  templateUrl: './clarisa-table.component.html',
  styleUrls: ['./clarisa-table.component.scss'],
})
export class ClarisaTableComponent {
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor() {}
  ELEMENT_DATA: Clarisa[] = [
    {
      id: 1,
      clarisaName: 'Scaling impact',
      clarisaAcronym: 'Scaling impact',
    },
  ];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  displayedColumns: string[] = ['id', 'clarisaName', 'clarisaAcronym'];
  dataSource = new MatTableDataSource<Clarisa>(this.ELEMENT_DATA);

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
