import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { TrainingDataService } from 'src/app/services/training-data.service';

export interface DialogData {
  id: number;
}

@Component({
  selector: 'app-training-data-add-dialog',
  templateUrl: './training-data-add-dialog.component.html',
  styleUrls: ['./training-data-add-dialog.component.scss'],
})
export class TrainingDataAddDialogComponent implements OnInit {
  form: FormGroup<any> = new FormGroup([]);

  constructor(
    public dialogRef: MatDialogRef<TrainingDataAddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: DialogData,
    private trainingDataService: TrainingDataService,
    private toast: ToastrService,
    private fb: FormBuilder
  ) {}

  async ngOnInit() {
    this.formInit();
    this.patchForm();
  }

  get id() {
    return this.data?.id;
  }

  async patchForm() {
    if (this.id) {
      const data = await this.trainingDataService.getTrainingData(this.id);
      this.form.patchValue(data);
    }
  }

  private async formInit() {
    this.form = this.fb.group({
      text: [null, Validators.required],
      source: ['system/form', Validators.required],
      clarisa_id: [null, Validators.required],
    });
  }

  async submit() {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
    if (this.form.valid) {
      await this.trainingDataService
        .submitTrainingData(this.id, this.form.value)
        .then(
          () => {
            if (this.id) this.toast.success('Training data added successfully');
            else this.toast.success('Training data updated successfully');
            this.dialogRef.close({ submitted: true });
          },
          (error) => this.toast.error(error.error.message)
        );
    }
  }
}
