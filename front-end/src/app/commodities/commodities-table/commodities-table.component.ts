import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CommoditiesService } from 'src/app/services/commodities.service';



@Component({
  selector: 'app-commodities-table',
  templateUrl: './commodities-table.component.html',
  styleUrls: ['./commodities-table.component.scss']
})
export class CommoditiesTableComponent {
  columnsToDisplay: string[] = ["id", "name", "parent_id"];
  dataSource!: MatTableDataSource<any>;
  allCommodities: any = [];
  
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;




  constructor( private commodities: CommoditiesService) {}

  


  ngOnInit() {
   
    this.initTable();

  }

  







  
  async initTable() {
    this.allCommodities = await this.commodities.getAllCommodities();
    this.dataSource = new MatTableDataSource(this.allCommodities);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;



    // for (let i = 0; i < this.organizations.length; i++) {
    //   for (let x = 0; x < this.predictions.length; x++) {
    //     if (this.organizations[i].id === this.predictions[x].clarisa_id) {
    //       this.organNames.push(this.organizations[i].name)
    //       this.organAcronyms.push(this.organizations[i].acronym)
    //       console.log(this.organNames);
    //       console.log(this.organAcronyms);
    //     }
    //   }
      
    // }
  
    // console.log(this.organizations)
 

    console.log(this.allCommodities)
    // this.title.setTitle("Periods");
    // this.meta.updateTag({ name: "description", content: "Periods" });
  }




    
    // this.title.setTitle("Periods");
    // this.meta.updateTag({ name: "description", content: "Periods" });
}
