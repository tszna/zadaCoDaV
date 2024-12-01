import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common'; 
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AppService } from '../../../app.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatInputModule, 
    MatButtonModule, 
    MatCardModule, 
    MatFormFieldModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError: string | null = null;
  isLoading: boolean = false;

  constructor(private fb: FormBuilder, private appService: AppService) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const loginData = this.loginForm.value;

      this.appService.login(loginData).subscribe({
        next: response => {
          this.isLoading = false;

        },
        error: error => {
          this.isLoading = false;
          console.error('Błąd logowania:', error);
          this.loginError = 'Nieprawidłowa nazwa użytkownika lub hasło.';
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

}
