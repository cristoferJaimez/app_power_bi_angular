import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {
  private logoutSubject = new Subject<void>();

  logout$ = this.logoutSubject.asObservable();

  triggerLogout() {
    this.logoutSubject.next();
  }
}
