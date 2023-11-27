import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PredictionsService } from 'src/app/services/predictions.service';


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
  columnsToDisplay: string[] = ["text", "acronym","code","confidant","cycle"];
  dataSource!: MatTableDataSource<any>;
  predictions: any = [];
  organizations: any = [];
  allTrainningCycle: any = [];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;


  constructor( private predictionsService: PredictionsService,) {}


  ngOnInit() {
   
    this.initTable();

  }
  
  async initTable() {
    this.predictions = await this.predictionsService.getAllPredictions(
    
    );
    this.dataSource = new MatTableDataSource(this.predictions);
    
 

    console.log(this.predictions)
    // this.title.setTitle("Periods");
    // this.meta.updateTag({ name: "description", content: "Periods" });
  }
  

    
    // this.title.setTitle("Periods");
    // this.meta.updateTag({ name: "description", content: "Periods" });
  }



