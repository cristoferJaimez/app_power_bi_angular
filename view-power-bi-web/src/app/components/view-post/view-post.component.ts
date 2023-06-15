import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { AnimationItem } from 'lottie-web';
import * as lottie from 'lottie-web';

@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.css']
})
export class ViewPostComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('animationContainer') animationContainer!: ElementRef;

  animationItem!: AnimationItem;

  posts: any[] = []; // Arreglo de posts
  pageIndex = 0; // Índice de página actual
  pageSize = 10; // Tamaño de página
  totalPosts = 0; // Total de posts

  ngOnInit() {
    // Lógica de inicialización del componente
    // Aquí puedes cargar los posts, establecer valores iniciales, etc.
    // Ejemplo de llenado del arreglo posts con un post de ejemplo

  }

  ngOnDestroy() {
    // Lógica de destrucción del componente
    // Aquí puedes limpiar recursos, cancelar suscripciones, etc.
  }

  eliminarPost(postId: string) {
    // Lógica para eliminar el post
    // ...
  }

  editarPost(postId: string) {
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
}
