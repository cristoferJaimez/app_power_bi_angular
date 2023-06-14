import { Component, OnInit } from '@angular/core';
import { LogoutService } from './services/logout.service';
import { AuthService } from './services/auth-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  token: string | null;
  description: string | null;
  url: string | null;
  img: string | null;
  type_user: string | null;
  isLoggedIn: boolean = false;

  constructor(private logoutService: LogoutService, private authService: AuthService) {
    this.token = localStorage.getItem('token');
    this.description = localStorage.getItem('description') || null;
    this.url = localStorage.getItem('url') || null;
    this.img = localStorage.getItem('img') || null;
    this.type_user = localStorage.getItem('type_user') || null;
  }

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });

    this.authService.descriptionSubject.subscribe((description) => {
      this.description = description ? description.toUpperCase() : null;
    });

    this.authService.imageUrlSubject.subscribe((url) => {
      this.url = url ? url : null;
    });

    this.authService.typeUserSubject.subscribe((type_user) => {
      this.type_user = type_user ? type_user : null;
    });

    
  }

  login() {
    // Lógica de inicio de sesión
    this.authService.setLoggedIn(true);
  }
  
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('description');
    localStorage.removeItem('url');
    localStorage.removeItem('img');
    localStorage.removeItem('type_user');
    this.token = null;
    this.description = null;
    this.url = null;
    this.img = null;
    this.type_user = null;
    this.logoutService.triggerLogout();
    this.authService.setLoggedIn(false);
  }
}
