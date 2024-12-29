import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { credentialsInterceptor } from './app/app/utils/credentials.interceptor';
import { MatNativeDateModule } from '@angular/material/core';
import { importProvidersFrom } from '@angular/core';
import { NgxPiwikProModule } from '@piwikpro/ngx-piwik-pro';


bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(MatNativeDateModule, NgxPiwikProModule.forRoot('0d314679-75fb-4ce1-ac29-25f1e0661661', 'https://wpxu.piwik.pro')),
    provideHttpClient(
      withInterceptors([credentialsInterceptor])
    ),
    provideAnimations(),
    provideRouter(routes),
  ],
});