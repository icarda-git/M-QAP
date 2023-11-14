import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

export interface TrainingCycle {
  id: number;
  text: string;
  clarisaName: string;
  clarisaAcronym: string;
  confident: string;
  cycle: string;
}

@Component({
  selector: 'app-predictions-table',
  templateUrl: './predictions-table.component.html',
  styleUrls: ['./predictions-table.component.scss'],
})
export class PredictionsTableComponent {
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor() {}

  ELEMENT_DATA: TrainingCycle[] = [
    {
      id: 1,
      text: 'Scaling impact, Operations, Legal, Funding, Partners and Partnerships	',
      clarisaName: 'Scaling impact',
      clarisaAcronym: 'Scaling impact',
      confident: 'Scaling impact',
      cycle: 'Scaling impact',
    },
  ];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  displayedColumns: string[] = [
    'id',
    'text',
    'clarisaName',
    'clarisaAcronym',
    'confident',
    'cycle',
  ];
  dataSource = new MatTableDataSource<TrainingCycle>(this.ELEMENT_DATA);

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
