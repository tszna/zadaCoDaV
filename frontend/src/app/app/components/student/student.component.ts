import { Component, OnInit } from '@angular/core';
import { AppService, ErasmusIn } from '../../../app.service';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { formatDate } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { EditErasmusComponent } from '../modals/edit-erasmus/edit-erasmus.component';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDatepickerModule
  ],
  templateUrl: './student.component.html',
  styleUrl: './student.component.css',
  animations: [
    trigger('formAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.9)' })),
      ]),
    ]),
  ],
})
export class StudentComponent implements OnInit {
  displayedColumns: string[] = ['destination_name', 'departure_date', 'actions'];
  dataSource: ErasmusIn[] = [];
  isLoading = true;
  showForm = false;
  addTripForm: FormGroup;

  constructor(private appService: AppService, private fb: FormBuilder, public dialog: MatDialog) {
    this.addTripForm = this.fb.group({
      destination_name: ['', [Validators.required]],
      departure_date: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.fetchErasmusInList();
  }

  fetchErasmusInList(): void {
    this.appService.getErasmusInList().subscribe({
      next: data => {
        this.dataSource = data;
        this.isLoading = false;
      },
      error: error => {
        console.error('Błąd podczas pobierania danych:', error);
        this.isLoading = false;
      }
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
  }

  onSubmit(): void {
    if (this.addTripForm.valid) {
      const formValues = this.addTripForm.value;
      const tripData = {
        destination_name: formValues.destination_name,
        departure_date: formatDate(formValues.departure_date, 'yyyy-MM-dd', 'en-US'),
      };

      this.appService.addErasmusIn(tripData).subscribe({
        next: response => {
          this.addTripForm.reset();
          this.showForm = false;
          this.fetchErasmusInList();
        },
        error: error => {
          console.error('Błąd podczas dodawania wyjazdu:', error);
        }
      });
    } else {
      this.addTripForm.markAllAsTouched();
    }
  }

  openEditDialog(element: ErasmusIn): void {
    const dialogRef = this.dialog.open(EditErasmusComponent, {
      width: '400px',
      data: { ...element },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'updated') {
        this.fetchErasmusInList();
      }
    });
  }

  deleteErasmusIn(id: number): void {
    if (confirm('Czy na pewno chcesz usunąć ten wyjazd?')) {
      this.appService.deleteErasmusIn(id).subscribe({
        next: response => {
          this.fetchErasmusInList();
        },
        error: error => {
          console.error('Błąd podczas usuwania wyjazdu:', error);
        }
      });
    }
  }
}
