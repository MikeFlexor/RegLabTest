import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { Store } from "@ngxs/store";
import { DataState } from "../store/state";

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private router: Router, private store: Store) {}

  canActivate() {
    if (this.store.selectSnapshot(DataState.currentUser)) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}
