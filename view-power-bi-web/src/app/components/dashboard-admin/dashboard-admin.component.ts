import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LogoutService } from '../../services/logout.service';
import { AuthService } from '../../services/auth-service.service';
import { MatDialog } from '@angular/material/dialog';
import { ReportModalComponent } from '../report-modal/report-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReportModalService } from '../../services/report-credentials.service';
import { NewUserComponent } from '../new-user/new-user.component';
import { NewPostComponent } from '../new-post/new-post.component';
import { ViewPostComponent } from '../view-post/view-post.component'
import { ViewUsersComponent } from '../view-users/view-users.component'
import { environment } from '../../../environment'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent implements OnInit {
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
    
  ) {}

  ngOnInit() {
    this.logoutService.logout$.subscribe(() => {
      this.verifyToken();
    });

    this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });

    this.setDescriptionInAuthService();
    this.verifyToken();
  
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

  openNewUserModal() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
  
    // Calcula el ancho y alto de la modal en función del tamaño de la ventana y el margen que deseas dejar
    const modalWidth = windowWidth * 0.8; // Por ejemplo, ocupa el 80% del ancho de la ventana
    const modalHeight = windowHeight * 0.7; // Por ejemplo, ocupa el 80% del alto de la ventana
  
    const dialogRef = this.dialog.open(NewUserComponent, {
      width: `${modalWidth}px`,
      height: `${modalHeight}px`,
      // También puedes ajustar otras opciones de la modal según tus necesidades
    });
  
    dialogRef.afterClosed().subscribe(result => {
      // Aquí puedes realizar acciones después de que se cierre el modal, si es necesario
    });
  }
  

  openNewPostModal() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
  
    // Calcula el ancho y alto de la modal en función del tamaño de la ventana y el margen que deseas dejar
    const modalWidth = windowWidth * 0.8; // Por ejemplo, ocupa el 80% del ancho de la ventana
    const modalHeight = windowHeight * 0.8; // Por ejemplo, ocupa el 80% del alto de la ventana
  
    const dialogRef = this.dialog.open(NewPostComponent, {
      width: `${modalWidth}px`,
      height: `${modalHeight}px`,
      // También puedes ajustar otras opciones de la modal según tus necesidades
    });
  
    dialogRef.afterClosed().subscribe(result => {
      // Aquí puedes realizar acciones después de que se cierre el modal, si es necesario
    });
  }
  

  openViewUserModal() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
  
    // Calcula el ancho y alto de la modal en función del tamaño de la ventana y el margen que deseas dejar
    const modalWidth = windowWidth * 0.8; // Por ejemplo, ocupa el 80% del ancho de la ventana
    const modalHeight = windowHeight * 0.7; // Por ejemplo, ocupa el 80% del alto de la ventana
  
    const dialogRef = this.dialog.open(ViewUsersComponent, {
      width: `100%`,
      height: `100%`,
      // También puedes ajustar otras opciones de la modal según tus necesidades
    });
  
    dialogRef.afterClosed().subscribe(result => {
      // Aquí puedes realizar acciones después de que se cierre el modal, si es necesario
    });
  }

  openViewPostModal() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
  
    // Calcula el ancho y alto de la modal en función del tamaño de la ventana y el margen que deseas dejar
    const modalWidth = windowWidth * 0.8; // Por ejemplo, ocupa el 80% del ancho de la ventana
    const modalHeight = windowHeight * 0.7; // Por ejemplo, ocupa el 80% del alto de la ventana
  
    const dialogRef = this.dialog.open(ViewPostComponent, {
      width: `100%`,
      height: `100%`,
      // También puedes ajustar otras opciones de la modal según tus necesidades
    });
  
    dialogRef.afterClosed().subscribe(result => {
      // Aquí puedes realizar acciones después de que se cierre el modal, si es necesario
    });
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
    const  type_user = localStorage.getItem('type_user');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'User_Type': type_user || ''// Enviar el tipo de usuario en el encabezado
      })
    };
    if (token) {
      httpOptions.headers = httpOptions.headers.set('Authorization', token);
      //console.log(httpOptions.headers);
      
      const url =  `http://${environment.apiUrl}/verify-token`;
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

 

  openPowerBIReport() {
    this.loadPowerBIReport(1);
  }

  navigateToLogin() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  openReportModal() {
    const dialogRef = this.dialog.open(ReportModalComponent, {
      width: `100%`,
      height: `100%`,
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      // Aquí puedes realizar acciones después de que se cierre la modal, si es necesario
    });
  }

  loadPowerBIReport(reportId: number) {
    const url = `http://${environment.apiUrl}/powerbi-report-details/${reportId}`;
    this.http.get(url).subscribe(
      (response: any) => {
        if (response && response.reportId && response.embedUrl && response.accessToken) {
          const reportId = response.reportId;
          const embedUrl = response.embedUrl;
          const accessToken = response.accessToken;
          this.reportModalService.setEmbedConfig(reportId, embedUrl, accessToken);
        } else {
          console.log('No se encontró ningún reporte');
          this.snackBar.open('No se encontró ningún reporte', 'Cerrar', {
            duration: 3000,
            panelClass: 'danger-toast',
          });
        }
      },
      (error) => {
        console.error('No está autorizado para acceder al reporte', error);
        this.snackBar.open('No está autorizado para acceder al reporte', 'Cerrar', {
          duration: 3000,
          panelClass: 'danger-toast',
        });
      }
    );
  }
}
