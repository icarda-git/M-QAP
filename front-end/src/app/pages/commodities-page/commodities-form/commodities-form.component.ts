import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CommoditiesService } from 'src/app/services/commodities.service';

export interface DialogData {
  id: number;
}

@Component({
  selector: 'app-commodities-form',
  templateUrl: './commodities-form.component.html',
  styleUrls: ['./commodities-form.component.scss'],
})
export class CommoditiesFormComponent implements OnInit {
  form: FormGroup<any> = new FormGroup([]);

  constructor(
    public dialogRef: MatDialogRef<CommoditiesFormComponent>,
    @Inject(MAT_DIALOG_DATA) private data: DialogData,
    private commoditiesService: CommoditiesService,
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
      this.commoditiesService.get(this.id).subscribe((commodity) => {
        this.form.patchValue(commodity);
      });
    }
  }

  private async formInit() {
    this.form = this.fb.group({
      name: [null, Validators.required],
      parent: [null],
      source: ['system/form', Validators.required],
    });
  }

  submit() {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
    if (this.form.valid) {
      this.commoditiesService.upsert(this.id, this.form.value).subscribe({
        next: () => {
          if (this.id) this.toast.success('Commodity added successfully');
          else this.toast.success('Commodity updated successfully');
          this.dialogRef.close({ submitted: true });
        },
        error: (error: any) => this.toast.error(error.error.message),
      });
    }
  }
}
