import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PredictionsService } from 'src/app/services/predictions.service';
import { OrganizationsService } from 'src/app/services/organizations.service';




@Component({
  selector: 'app-predictions-table',
  templateUrl: './predictions-table.component.html',
  styleUrls: ['./predictions-table.component.scss'],
})
export class PredictionsTableComponent {
  columnsToDisplay: string[] = ["text", "name","acronym","confidant","cycle"];
  dataSource!: MatTableDataSource<any>;
  predictions: any = [];
  organizations: any = [];
  allTrainningCycle: any = [];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  // organNames: any =[];
  // organAcronyms: any=[];



  constructor( private predictionsService: PredictionsService,private organizationsService: OrganizationsService) {}

  


  ngOnInit() {
   
    this.initTable();

  }

  
  
  async initTable() {
    this.predictions = await this.predictionsService.getAllPredictions();
    this.dataSource = new MatTableDataSource(this.predictions);


this.organizations = await this.organizationsService.getOrganizations();

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
 

    console.log(this.predictions)
    // this.title.setTitle("Periods");
    // this.meta.updateTag({ name: "description", content: "Periods" });
  }




    
    // this.title.setTitle("Periods");
    // this.meta.updateTag({ name: "description", content: "Periods" });
  }



