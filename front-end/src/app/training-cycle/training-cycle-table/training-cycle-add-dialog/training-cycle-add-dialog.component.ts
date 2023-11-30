import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { TrainingCycleService } from "src/app/services/trainning-cycle.service";

export interface DialogData {
  id: number;
}

@Component({
  selector: 'app-training-cycle-add-dialog',
  templateUrl: './training-cycle-add-dialog.component.html',
  styleUrls: ['./training-cycle-add-dialog.component.scss'],
})
export class TrainingCycleAddDialogComponent implements OnInit {
  TrainningCycleId: number = 0;
  trainingFormCycle!: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<TrainingCycleAddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: DialogData,
    private trainningCycleService: TrainingCycleService,
    private toast: ToastrService,
    private fb: FormBuilder
  ) {
    this.TrainningCycleId = data.id;
  }

  ngOnInit() {
    this.formInit();
  }

  private async formInit() {
    this.trainingFormCycle = this.fb.group({
      text: [null, Validators.required],
      
    });
    if (this.TrainningCycleId) {
      let { id, ...trainningCycleValues } = await this.trainningCycleService.getTrainingCycle(this.TrainningCycleId);
      this.trainingFormCycle.setValue({
        ...trainningCycleValues,
      });
    }
  }

  async submit() {
    this.trainingFormCycle.markAllAsTouched();
   this.trainingFormCycle.updateValueAndValidity();
    if (this.trainingFormCycle.valid) {
      await this.trainningCycleService.submitTrainingCycle(this.TrainningCycleId, this.trainingFormCycle.value).then(
        (data) => {
          if (this.TrainningCycleId === 0) this.toast.success("trainningCycle added successfully");
          else this.toast.success("trainningCycle updated successfully");

          this.dialogRef.close({ submitted: true });
        },
        (error) => {
          this.toast.error(error.error.message);
        }
      );
    }
  }

  // async submit() {
  //   this.ipsrForm.markAllAsTouched();
  //   this.ipsrForm.updateValueAndValidity();
  //   if (this.ipsrForm.valid) {
  //     await this.ipsrService.submitIpsr(this.ipsrId, this.ipsrForm.value);
  //     this.toast.success("IPSR Item added Successfully");
  //     this.dialogRef.close({ submitted: true });
  //   }
  // }

  //Close-Dialog
  onCloseDialog() {
    this.dialogRef.close();
  }
}
