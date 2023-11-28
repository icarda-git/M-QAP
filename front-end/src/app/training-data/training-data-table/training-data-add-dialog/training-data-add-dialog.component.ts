import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { TrainningDataService } from "src/app/services/trainning-data.service";
import { OrganizationsService } from 'src/app/services/organizations.service';


export interface DialogData {
  id: number;
}

@Component({
  selector: 'app-training-data-add-dialog',
  templateUrl: './training-data-add-dialog.component.html',
  styleUrls: ['./training-data-add-dialog.component.scss'],
})
export class TrainingDataAddDialogComponent implements OnInit {
  TrainningDataId: number = 0;
  trainingFormData: FormGroup<any> = new FormGroup([]);
  organizations: any = [];
  TrainningData: any = [];
  k:any=[];
  constructor(
    private dialogRef: MatDialogRef<TrainingDataAddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: DialogData,
    private trainningDataService: TrainningDataService,
    private toast: ToastrService,
    private fb: FormBuilder,
    private organizationsService: OrganizationsService
  ) {
    this.TrainningDataId = data.id;
  }




  async ngOnInit() {
    this.formInit();
    this.organizations = await this.organizationsService.getOrganizations();
  
  }

  private async formInit() {
    
    this.trainingFormData = this.fb.group({
      text: [null, Validators.required],
      source: [null, Validators.required],
      clarisa_id: [null,Validators.required],
      
      
    }
    );

    
    if (this.TrainningDataId) {
      
      let { id,clarisa_id, ...trainningDataValues } = await this.trainningDataService.getTrainningData(
        this.TrainningDataId
      );
      this.trainingFormData.setValue({
        ...trainningDataValues,
        clarisa_id: clarisa_id ? clarisa_id : null,
      });
      
     
    }

    
  }
 
  async submit() {
    this.trainingFormData.markAllAsTouched();
    this.trainingFormData.updateValueAndValidity();
    if (this.trainingFormData.valid) {
      await this.trainningDataService
        .submitTrainningData(this.TrainningDataId, this.trainingFormData.value)
        .then(
          (data) => {
            if (this.TrainningDataId == 0)
              this.toast.success("trainningData added successfully");
            else this.toast.success("trainningData updated successfully");

            this.dialogRef.close({ submitted: true });
          },
          (error) => {
            this.toast.error(error.error.message);
          }
        );
    }
    
  }

  //Close-Dialog
  onCloseDialog() {
    this.dialogRef.close();
  }





  // onToppingRemoved(t: any) {
    
  //   const toppings = this.trainingFormData?.value?.clarisa_id as any[];
  //   this.removeFirst(toppings, t);
  //   this.trainingFormData.controls?.["clarisa_id"].setValue(toppings); // To trigger change detection
  // }

  // private removeFirst<T>(array: T[], toRemove: T): void {
  //   const index = array.indexOf(toRemove);
  //   if (index !== -1) {
  //     array.splice(index, 1);
  //   }
  // }
}
