import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { AnimationItem } from 'lottie-web';
import * as lottie from 'lottie-web';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment';
import { GroupUserComponent } from '../group-user/group-user.component';
import { InfoUserComponent } from '../info-user/info-user.component';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-view-users',
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.css']
})
export class ViewUsersComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('animationContainer') animationContainer!: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<ViewUsersComponent>,
    private http: HttpClient,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  animationItem!: AnimationItem;

  users: any[] = []; // Arreglo de usuarios
  pageIndex = 0; // Índice de página actual
  pageSize = 7; // Tamaño de página
  totalUsers = 0; // Total de usuarios

  searchText: string = '';
  filteredUsers: any[] = [];

  ngOnInit() {
    this.getAllUsers();
  }

  ngOnDestroy() {
    // Lógica de destrucción del componente
    // Aquí puedes limpiar recursos, cancelar suscripciones, etc.
  }

  eliminarUser(userId: string) {
    const apiUrl = `${environment.apiUrl}/toggle-user-status/${userId}`;
  
    // Mostrar alert para confirmar la eliminación del usuario
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.http.post(apiUrl, {}).subscribe(
        (response: any) => {
          console.log('Procedimiento almacenado ejecutado correctamente');
          // Realiza las acciones necesarias después de cambiar el estado del usuario
          // ...
  
          // Actualiza el estado del usuario y el ícono en el arreglo de usuarios filtrados
          const userIndex = this.filteredUsers.findIndex(user => user.id === userId);
  
          if (userIndex !== -1) {
            this.filteredUsers[userIndex].status = response.status === 0 ? 0 : 1;
            this.filteredUsers[userIndex].icon = response.status === 0 ? 'block' : 'check';
          }
  
          // Mostrar un toast para confirmar la eliminación del usuario
          this.snackBar.open('Usuario eliminado correctamente', 'Aceptar', {
            duration: 2000
          });
        },
        (error) => {
          console.error('Error al ejecutar el procedimiento almacenado: ', error);
          // Maneja el error de acuerdo a tus necesidades
          // ...
        }
      );
    }
  }
  
  activeUser(userId: string) {
    const apiUrl = `${environment.apiUrl}/toggle-user-status/${userId}`;
  
    // Mostrar alert para confirmar la activación del usuario
    if (confirm('¿Estás seguro de activar este usuario?')) {
      this.http.post(apiUrl, {}).subscribe(
        (response: any) => {
          console.log('Procedimiento almacenado ejecutado correctamente');
          // Realiza las acciones necesarias después de cambiar el estado del usuario
          // ...
  
          // Actualiza el estado del usuario y el ícono en el arreglo de usuarios filtrados
          const userIndex = this.filteredUsers.findIndex(user => user.id === userId);
  
          if (userIndex !== -1) {
            this.filteredUsers[userIndex].status = response.status === 0 ? 0 : 1;
            this.filteredUsers[userIndex].icon = response.status === 0 ? 'block' : 'check';
          }
  
          // Mostrar un toast para confirmar la activación del usuario
          this.snackBar.open('Usuario activado correctamente', 'Aceptar', {
            duration: 2000
          });
        },
        (error) => {
          console.error('Error al ejecutar el procedimiento almacenado: ', error);
          // Maneja el error de acuerdo a tus necesidades
          // ...
        }
      );
    }
  }
  
  
  

  editarUser(userId: string) {
    const dialogRef = this.dialog.open(EditUserComponent, {
      width: '100%',
      height: '70%',
      data: { reportId: userId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      // Aquí puedes realizar acciones después de que se cierre la modal, si es necesario
    });
  }

  infoUser(userId: string) {
    const dialogRef = this.dialog.open(InfoUserComponent, {
      width: '100%',
      height: '70%',
      data: { userId: userId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      // Aquí puedes realizar acciones después de que se cierre la modal, si es necesario
    });
  }

  grupoUser(userId: string) {
    const dialogRef = this.dialog.open(GroupUserComponent, {
      width: '100%',
      height: '70%',
      data: { userId: userId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      // Aquí puedes realizar acciones después de que se cierre la modal, si es necesario
    });
  }

  cambiarPagina(event: any) {
    this.pageIndex = event.pageIndex;
    this.filterUsers();
  }

  ngAfterViewInit() {
    const animationPath = './assets/images/98312-empty.json'; // Verifica la ruta del archivo JSON de la animación

    // Opciones de configuración de la animación (ajusta según tus necesidades)
    const animationOptions: lottie.AnimationConfigWithPath = {
      container: this.animationContainer.nativeElement,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: animationPath
    };

    // Cargar la animación utilizando lottie.default.loadAnimation()
    this.animationItem = lottie.default.loadAnimation(animationOptions);
  }

  closeModal() {
    this.dialogRef.close();
  }

  getAllUsers() {
    this.http.get<any[]>(`${environment.apiUrl}/users`).subscribe(
      (response) => {
        this.users = response;
        console.log(response);
        this.totalUsers = this.users.length;
        this.filterUsers(); // Apply initial filtering and pagination
      },
      (error) => {
        console.log(error);
      }
    );
  }

  filterUsers() {
    this.filteredUsers = this.users.filter((user) =>
      user.name.toLowerCase().includes(this.searchText.toLowerCase())
    );

    // Apply pagination
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredUsers = this.filteredUsers.slice(startIndex, endIndex);
  }

  changePage(event: any) {
    this.pageIndex = event.pageIndex;
    this.filterUsers();
  }
}
