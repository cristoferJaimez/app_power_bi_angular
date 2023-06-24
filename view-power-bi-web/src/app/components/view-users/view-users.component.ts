import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { AnimationItem } from 'lottie-web';
import * as lottie from 'lottie-web';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment';
import { GroupUserComponent } from '../group-user/group-user.component'
import { InfoUserComponent } from '../info-user/info-user.component'
import { EditUserComponent } from '../edit-user/edit-user.component'

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
    // Lógica para eliminar el usuario
    // ...
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
      
      data: { reportId: userId },
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      // Aquí puedes realizar acciones después de que se cierre la modal, si es necesario
    });
  }



  
  grupoUser(userId: string) {
    const dialogRef = this.dialog.open(GroupUserComponent, {
      width: '100%',
      height: '70%',
      
      data: { reportId: userId },
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
