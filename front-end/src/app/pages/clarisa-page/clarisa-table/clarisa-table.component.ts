import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { OrganizationsService } from 'src/app/services/organizations.service';


@Component({
  selector: 'app-clarisa-table',
  templateUrl: './clarisa-table.component.html',
  styleUrls: ['./clarisa-table.component.scss'],
})
export class ClarisaTableComponent {
  columnsToDisplay: string[] = ["name", "acronym", "code"];
  dataSource!: MatTableDataSource<any>;
  organizations: any = [];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor( private organizationsService: OrganizationsService) {}


  ngOnInit() {
   
    this.initTable();

  }
  async initTable() {
    this.organizations = await this.organizationsService.getOrganizations();
    this.dataSource = new MatTableDataSource(this.organizations);
      console.log(this.organizations)
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
  }


 

  // ngAfterViewInit() {
  //   this.dataSource.paginator = this.paginator;
  //   this.dataSource.sort = this.sort;
  // }
}
