
import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { AnimationItem } from 'lottie-web';
import * as lottie from 'lottie-web';
import { MatDialogRef } from '@angular/material/dialog';



@Component({
  selector: 'app-view-users',
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.css']
})
export class ViewUsersComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('animationContainer') animationContainer!: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<ViewUsersComponent>
  ){}

  animationItem!: AnimationItem;

  users: any[] = []; // Arreglo de posts
  pageIndex = 0; // Índice de página actual
  pageSize = 10; // Tamaño de página
  totalusers = 0; // Total de posts

  ngOnInit() {
    // Lógica de inicialización del componente
    // Aquí puedes cargar los posts, establecer valores iniciales, etc.
    // Ejemplo de llenado del arreglo posts con un post de ejemplo

  }

  ngOnDestroy() {
    // Lógica de destrucción del componente
    // Aquí puedes limpiar recursos, cancelar suscripciones, etc.
  }

  eliminaruser(postId: string) {
    // Lógica para eliminar el post
    // ...
  }

  editaruser(postId: string) {
    // Lógica para editar el post
    // ...
  }

  cambiarPagina(event: any) {
    this.pageIndex = event.pageIndex;
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
}
