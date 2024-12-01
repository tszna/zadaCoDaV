import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { formatDate } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AppService, ErasmusIn } from '../../../../app.service';


@Component({
  selector: 'app-edit-erasmus',
  templateUrl: './edit-erasmus.component.html',
  styleUrls: ['./edit-erasmus.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDatepickerModule
  ],
})
export class EditErasmusComponent {
  editForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditErasmusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ErasmusIn,
    private fb: FormBuilder,
    private appService: AppService
  ) {
    this.editForm = this.fb.group({
      departure_date: [new Date(this.data.departure_date), Validators.required],
    });
  }

  onSubmit(): void {
    if (this.editForm.valid) {
      const updatedData = {
        id: this.data.id,
        departure_date: formatDate(this.editForm.value.departure_date, 'yyyy-MM-dd', 'en-US'),
      };

      this.appService.updateErasmusIn(updatedData).subscribe({
        next: response => {
          this.dialogRef.close('updated');
        },
        error: error => {
          console.error('Błąd podczas aktualizacji wyjazdu:', error);
        }
      });
    } else {
      this.editForm.markAllAsTouched();
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
