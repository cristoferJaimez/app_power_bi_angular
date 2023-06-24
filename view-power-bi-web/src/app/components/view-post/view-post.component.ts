import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { AnimationItem } from 'lottie-web';
import * as lottie from 'lottie-web';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UpdatePostComponent }  from '../update-post/update-post.component'
import { ReportModalComponent } from '../report-modal/report-modal.component';
import { ReportModalService } from '../../services/report-modal.service'; // Import the PostService
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.css']
})
export class ViewPostComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('animationContainer') animationContainer!: ElementRef;

  searchText: string = '';
  post!: any;
  constructor(
    public dialogRef: MatDialogRef<ViewPostComponent>,
    private http: HttpClient,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private postService: ReportModalService
  ) {}

  animationItem!: AnimationItem;

  posts: any[] = []; // Arreglo de posts
  pageIndex = 0; // Índice de página actual
  pageSize = 6; // Tamaño de página
  filteredPosts: any[] = [];
  paginatedPosts: any[] = [];

  postSubscription!: Subscription;

ngOnInit() {
  this.getPosts();
  console.log(this.postService.getPost());
  
  this.post = this.postService.getPost();

  // Suscribirse al observable getPostSubject() para recibir actualizaciones del post
  this.postSubscription = this.postService.getPostSubject().subscribe((post) => {
    this.post = post;
    this.getPosts();
    // Actualizar la vista con los nuevos datos del post
  });
}

  getPosts() {
    const url = `${environment.apiUrl}/items`; // Ajusta la URL de la ruta de tu API
  
    this.http.get<any[]>(url).subscribe(
      (response: any[]) => {
        this.posts = response;
        //console.log(response);
        
        // Filtrar los posts según el texto de búsqueda
        this.filterPosts();
      },
      (error: HttpErrorResponse) => {
        console.error('Error al obtener los posts:', error);
      }
    );
  }

  filterPosts() {
    if (this.searchText.trim() !== '') {
      this.filteredPosts = this.posts.filter(post => {
        const company = post.company ? post.company.toLowerCase() : '';
        const dateCreate = post.date_create ? post.date_create.toLowerCase() : '';
        const description = post.description ? post.description.toLowerCase() : '';
        const title = post.title ? post.title.toLowerCase() : '';
        
        return (
          company.includes(this.searchText.toLowerCase()) ||
          dateCreate.includes(this.searchText.toLowerCase()) ||
          description.includes(this.searchText.toLowerCase()) ||
          title.includes(this.searchText.toLowerCase())
        );
      });
    } else {
      this.filteredPosts = this.posts;
    }
    
    this.updatePaginatedPosts();
  }

  updatePaginatedPosts() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedPosts = this.filteredPosts.slice(startIndex, endIndex);
  }

  changePage(event: any) {
    this.pageIndex = event.pageIndex;
    this.updatePaginatedPosts();
  }

  eliminarPost(postId: string) {
    const confirmed = confirm('¿Estás seguro de que deseas eliminar este post?');
    if (confirmed) {
      const url = `${environment.apiUrl}/eliminar-post/${postId}`; // Ajusta la URL de la ruta de tu API
  
      this.http.get<any>(url).subscribe(
        (response: any) => {
          const newStatus = response.newStatus;
          //console.log('Nuevo estado del post:', newStatus);
  
          // Actualizar el estado del post en la lista de posts
          const post = this.posts.find(post => post.id === postId);
          if (post) {
            post.estatus = newStatus;
          }
  
          // Actualizar la lista de posts paginados
          this.updatePaginatedPosts();
  
          this.snackBar.open('El post ha sido eliminado correctamente.', 'Cerrar', {
            duration: 3000
          });
        },
        (error: HttpErrorResponse) => {
          console.error('Error al eliminar el post:', error);
        }
      );
    }
  }
  
  publicarPost(postId: string) {
    const confirmed = confirm('¿Estás seguro de que deseas publicar este post?');
    if (confirmed) {
      const url = `${environment.apiUrl}/restaurar-post/${postId}`; // Ajusta la URL de la ruta de tu API
  
      this.http.get<any>(url).subscribe(
        (response: any) => {
          const newStatus = response.newStatus;
          //console.log('Nuevo estado del post:', newStatus);
  
          // Actualizar el estado del post en la lista de posts
          const post = this.posts.find(post => post.id === postId);
          if (post) {
            post.estatus = newStatus;
          }
  
          // Actualizar la lista de posts paginados
          this.updatePaginatedPosts();
  
          this.snackBar.open('El post ha sido publicado correctamente.', 'Cerrar', {
            duration: 3000
          });
        },
        (error: HttpErrorResponse) => {
          console.error('Error al restaurar el post:', error);
        }
      );
    }
  }


  editarPost(postId: string) {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
  
    // Calcula el ancho y alto de la modal en función del tamaño de la ventana y el margen que deseas dejar
    const modalWidth = windowWidth * 0.8; // Por ejemplo, ocupa el 80% del ancho de la ventana
    const modalHeight = windowHeight * 0.7; // Por ejemplo, ocupa el 80% del alto de la ventana
  
    const dialogRef = this.dialog.open(UpdatePostComponent, {
      width: `100%`,
      height: `70%`,
      data: { postId }
      // También puedes ajustar otras opciones de la modal según tus necesidades
    });
  
    dialogRef.afterClosed().subscribe(result => {
      // Aquí puedes realizar acciones después de que se cierre el modal, si es necesario
    });
  }

  ngAfterViewInit() {
    const animationPath = '../../../assets/images/98312-empty.json'; // Verifica la ruta del archivo JSON de la animación

    const animationOptions: lottie.AnimationConfigWithPath = {
      container: this.animationContainer.nativeElement,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: animationPath
    };

    this.animationItem = lottie.default.loadAnimation(animationOptions);
  }

  closeModal() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.postSubscription.unsubscribe();
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
}
