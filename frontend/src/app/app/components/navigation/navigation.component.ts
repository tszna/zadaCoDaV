import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AppService } from '../../../app.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    RouterModule,
    MatToolbarModule,
    MatButtonModule
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent {
  constructor(private appService: AppService, private router: Router) {}
  logout() {
    this.appService.logout().subscribe({
      next: response => {
        this.router.navigate(['/']);
      },
      error: error => {
        console.error('Błąd podczas wylogowywania:', error);
      }
    });
  }

}
