import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef  } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LogoutService } from '../../services/logout.service';
import { AuthService } from '../../services/auth-service.service';
import { MatDialog,  MatDialogConfig  } from '@angular/material/dialog';
import { ReportModalComponent } from '../report-modal/report-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReportModalService } from '../../services/report-credentials.service';
import { PowerBiService } from '../../services/powerbi.service';
import { AnimationItem } from 'lottie-web';
import * as lottie from 'lottie-web';
import { environment } from '../../environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit{

  @ViewChild('animationContainer') animationContainer!: ElementRef;

  animationItem!: AnimationItem;

  isLoggedIn: boolean = false;
  posts: any[] = [];
  description: string | null = "";

  constructor(
    private router: Router,
    private http: HttpClient,
    private dialog: MatDialog,
    private logoutService: LogoutService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private reportModalService: ReportModalService,
    private powerBiService: PowerBiService
  ) { }

  ngOnInit() {
    this.logoutService.logout$.subscribe(() => {
      this.verifyToken();
    });

    this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });

    this.setDescriptionInAuthService();
    this.verifyToken();
    this.getPosts();
  }

  setDescriptionInAuthService() {
    const description = localStorage.getItem('description');
    const img = localStorage.getItem('img');
    const url = localStorage.getItem('url');
    const typeUser = localStorage.getItem('type_user');

    this.authService.setImageUrl(img);
    this.authService.setImageUrl(url);
    this.authService.setTypeUser(typeUser);
    this.authService.setDescription(description);
  }

  toggleDescription(post: any) {
    post.showFullDescription = !post.showFullDescription;
  }

  truncateDescription(description: string) {
    if (description.length > 100) {
      return description.slice(0, 100) + '...';
    } else {
      return description;
    }
  }

  verifyToken() {
    const token = localStorage.getItem('token');
    const type_user = localStorage.getItem('type_user');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'User_Type': type_user || ''// Enviar el tipo de usuario en el encabezado
      })
    };
    if (token) {
      httpOptions.headers = httpOptions.headers.set('Authorization', token);

      const url = `${environment.apiUrl}/verify-token`;
      this.http.get(url, httpOptions).subscribe(
        (response) => {
          this.authService.setLoggedIn(true);
        },
        (error) => {
          this.navigateToLogin();
        }
      );
    } else {
      this.navigateToLogin();
    }
  }

  getPosts() {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('id');

    if (!token) {
      return;
    }

    const headers = new HttpHeaders().set('Authorization', token);

    const url = `${environment.apiUrl}/list-items/${userId}`;
    this.http.get(url, { headers }).subscribe(
      (response: any) => {
        const posts = response;
        
        if (Array.isArray(posts) && posts.length > 0) {
          this.posts = posts.map((post: any) => {
            post.showFullDescription = false;
            return post;
          });
        } else {
          this.posts = [];
        }
      },
      (error) => {
        console.error('Error al obtener los posts del usuario:', error);
        this.snackBar.open('No tienes reportes disponibles', 'Cerrar', {
          duration: 3000,
          panelClass: 'danger-toast'
        });
      }
    );
  }

  openPowerBIReport(id: number) {
    const dialogRef = this.dialog.open(ReportModalComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '100wv',
      data: { reportId: id },
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      // Aquí puedes realizar acciones después de que se cierre la modal, si es necesario
    });
  }

  navigateToLogin() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  openReportModal() {
    const dialogRef = this.dialog.open(ReportModalComponent, {
      //width: '1900px',
      //data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      // Aquí puedes realizar acciones después de que se cierre la modal, si es necesario
    });
  }

  ngAfterViewInit() {
    const animationPath = './assets/images/19314-sequis-empty-state.json';

    const animationOptions: lottie.AnimationConfigWithPath = {
      container: this.animationContainer.nativeElement,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: animationPath
    };

    this.animationItem = lottie.default.loadAnimation(animationOptions);
  }
}
