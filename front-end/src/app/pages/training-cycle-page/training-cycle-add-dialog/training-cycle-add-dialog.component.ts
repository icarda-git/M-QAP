import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { TrainingCycleService } from 'src/app/services/training-cycle.service';

export interface DialogData {
  id: number;
}

@Component({
  selector: 'app-training-cycle-add-dialog',
  templateUrl: './training-cycle-add-dialog.component.html',
  styleUrls: ['./training-cycle-add-dialog.component.scss'],
})
export class TrainingCycleAddDialogComponent implements OnInit {
  id: number = 0;
  form!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<TrainingCycleAddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: DialogData,
    private trainingCycleService: TrainingCycleService,
    private toast: ToastrService,
    private fb: FormBuilder
  ) {
    this.id = data.id;
  }

  ngOnInit() {
    this.formInit();
  }

  private async formInit() {
    this.form = this.fb.group({
      text: [null, Validators.required],
    });
    if (this.id) {
      let { id, ...trainingCycleValues } =
        await this.trainingCycleService.getTrainingCycle(this.id);
      this.form.setValue({
        ...trainingCycleValues,
      });
    }
  }

  async submit() {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
    if (this.form.valid) {
      await this.trainingCycleService
        .submitTrainingCycle(this.id, this.form.value)
        .then(
          (data) => {
            if (this.id === 0)
              this.toast.success('trainingCycle added successfully');
            else this.toast.success('trainingCycle updated successfully');

            this.dialogRef.close({ submitted: true });
          },
          (error) => {
            this.toast.error(error.error.message);
          }
        );
    }
  }
}
