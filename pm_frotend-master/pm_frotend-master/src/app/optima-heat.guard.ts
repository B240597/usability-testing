import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OHGuard implements CanActivate {
  constructor(private router : Router) { }
  canActivate(next: ActivatedRouteSnapshot,state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    var userTypeId = JSON.parse(localStorage.getItem('userId'));
    let permissionId = next.data["permissionId"];
    if(permissionId === userTypeId )
      return true;
    else 
      return false;
  }
}