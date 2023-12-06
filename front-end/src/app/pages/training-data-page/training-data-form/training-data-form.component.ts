import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { TrainingDataService } from 'src/app/services/training-data.service';

export interface DialogData {
  id?: number;
  data?: any;
}

@Component({
  selector: 'app-training-data-form',
  templateUrl: './training-data-form.component.html',
  styleUrls: ['./training-data-form.component.scss'],
})
export class TrainingDataFormComponent implements OnInit {
  form!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<TrainingDataFormComponent>,
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

  patchForm() {
    if (this.id) {
      this.trainingDataService.get(this.id).subscribe((data) => {
        this.form.patchValue(data);
      });
    } else if (!!this.data?.data) {
      this.form.patchValue(this.data.data);
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
        .upsert(this.id, this.form.value)
        .subscribe({
          next: () => {
            if (this.id) this.toast.success('Training data added successfully');
            else this.toast.success('Training data updated successfully');
            this.dialogRef.close({ submitted: true });
          },
          error: (error) => {
            console.log(error);
            if (this.id) this.toast.error('Training data failed to update');
            else this.toast.error('Training data failed to add');
            this.toast.error(error.error.message);
          },
        });
    }
  }
}
