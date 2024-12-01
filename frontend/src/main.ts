import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { credentialsInterceptor } from './app/app/utils/credentials.interceptor';
import { MatNativeDateModule } from '@angular/material/core';
import { importProvidersFrom } from '@angular/core';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(MatNativeDateModule),
    provideHttpClient(
      withInterceptors([credentialsInterceptor])
    ),
    provideAnimations(),
    provideRouter(routes),
  ],
});