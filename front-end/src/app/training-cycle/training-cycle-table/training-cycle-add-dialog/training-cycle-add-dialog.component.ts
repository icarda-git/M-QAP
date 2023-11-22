import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-training-cycle-add-dialog',
  templateUrl: './training-cycle-add-dialog.component.html',
  styleUrls: ['./training-cycle-add-dialog.component.scss'],
})
export class TrainingCycleAddDialogComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<TrainingCycleAddDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public trainingCycle: { title: any; element: any; id: any }
  ) {}

  trainingFormCycle = new FormGroup({
    name: new FormControl('', Validators.required),
  });

  async setValue() {
    if (this.trainingCycle.element != null) {
      this.trainingFormCycle.patchValue({
        name: this.trainingCycle.element.name,
      });
    }
  }

  ngOnInit(): void {}

  //Close-Dialog
  onCloseDialog() {
    this.dialogRef.close();
  }
}
