import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-training-data-add-dialog',
  templateUrl: './training-data-add-dialog.component.html',
  styleUrls: ['./training-data-add-dialog.component.scss'],
})
export class TrainingDataAddDialogComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<TrainingDataAddDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public trainingData: { title: any; element: any; id: any }
  ) {}

  trainingFormData = new FormGroup({
    text: new FormControl('', Validators.required),
    clarisa: new FormControl('', Validators.required),
    source: new FormControl('', Validators.required),
  });

  async setValue() {
    if (this.trainingData.element != null) {
      this.trainingFormData.patchValue({
        text: this.trainingData.element.text,
        clarisa: this.trainingData.element.clarisa,
        source: this.trainingData.element.source,
      });
    }
  }

  ngOnInit(): void {}

  //Close-Dialog
  onCloseDialog() {
    this.dialogRef.close();
  }
}
