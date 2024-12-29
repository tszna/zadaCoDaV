import { Component, OnDestroy  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { LoginComponent } from './app/components/login/login.component';
import { NavigationComponent } from './app/components/navigation/navigation.component';
import { AppService } from './app.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    LoginComponent, 
    NavigationComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnDestroy {
  isAuthenticated = false;
  username: string | null = null;
  currentUrl: string = '';

  private subscriptions: Subscription = new Subscription();

  constructor(private appService: AppService, private router: Router) {
    this.subscriptions.add(
      this.appService.isAuthenticated$.subscribe((authStatus) => {
        this.isAuthenticated = authStatus;
      })
    );

    this.subscriptions.add(
      this.appService.username$.subscribe((name) => {
        this.username = name;
      })
    );

    this.appService.checkAuthStatus().subscribe();

    this.currentUrl = this.router.url;

    this.subscriptions.add(
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.currentUrl = event.urlAfterRedirects;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  get isHomePage(): boolean {
    return this.currentUrl === '/';
  }
}