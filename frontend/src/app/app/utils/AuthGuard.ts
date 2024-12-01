import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AppService } from '../../app.service';


@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private appService: AppService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.appService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }

    const requiredRoles = next.data['roles'] as Array<string>;
    const userRoles = this.appService.getUserRoles();

    const hasRole = userRoles.some(role => requiredRoles.includes(role));

    if (hasRole) {
      return true;
    } else {
      this.router.navigate(['/not-authorized']);
      return false;
    }
  }
}