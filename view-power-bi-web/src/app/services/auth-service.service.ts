import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  descriptionSubject = new BehaviorSubject<string | null>(null);
  imageUrlSubject = new BehaviorSubject<string | null>(null);
  typeUserSubject = new BehaviorSubject<string | null>(null);


  constructor() {
  
    this.descriptionSubject.next(localStorage.getItem('description'));
    this.imageUrlSubject.next(localStorage.getItem('url'));
    this.typeUserSubject.next(localStorage.getItem('type_user'));
    
  }

  setLoggedIn(value: boolean) {
    this.isLoggedInSubject.next(value);
  }

  setDescription(description: string | null) {
    this.descriptionSubject.next(description);
  }

  setImageUrl(imageUrl: string | null) {
    this.imageUrlSubject.next(imageUrl);
  }

  setTypeUser(typeUser: string | null) {
    this.typeUserSubject.next(typeUser);
  }
  
  
}
