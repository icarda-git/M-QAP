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
  form!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<TrainingCycleAddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: DialogData,
    private trainingCycleService: TrainingCycleService,
    private toast: ToastrService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.formInit();
    this.patchForm();
  }

  formInit() {
    this.form = this.fb.group({
      text: [null, Validators.required],
    });
  }

  get id() {
    return this.data?.id;
  }

  patchForm() {
    if (this.id) {
      this.trainingCycleService.get(this.id).subscribe((data) => {
        this.form.patchValue(data);
      });
    }
  }

  async submit() {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
    if (this.form.valid) {
      await this.trainingCycleService
        .upsert(this.id, this.form.value)
        .subscribe({
          next: () => {
            if (this.id) {
              this.toast.success('Training cycle updated  successfully');
            } else {
              this.toast.success('Training cycle added successfully');
            }
            this.dialogRef.close({ submitted: true });
          },
          error: (error) => {
            this.toast.error(error.error.message);
          },
        });
    }
  }
}
