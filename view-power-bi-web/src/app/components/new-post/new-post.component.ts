import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ElementRef } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent implements OnInit {
  labOptions: any[] = []; // Arreglo para almacenar las opciones de laboratorio

  form = new FormGroup({
    lab: new FormControl(''),
    title: new FormControl(''),
    description: new FormControl(''),
    reportID: new FormControl(''),
    reportURL: new FormControl(''),
    reportToken: new FormControl('')
  });

  constructor(private http: HttpClient, 
    private snackBar: MatSnackBar,
    private elementRef: ElementRef,
    public dialogRef: MatDialogRef<NewPostComponent>) {}

  ngOnInit() {
    this.fetchLabOptions(); // Llamada al método para obtener las opciones de laboratorio
  }

  // Método para obtener las opciones de laboratorio
  fetchLabOptions() {
    const token = localStorage.getItem('token');
    const type_user = localStorage.getItem('type_user');
    const httpOptions = { 
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'User_Type': type_user || '', // Enviar el tipo de usuario en el encabezado
        'Authorization': token || '' // Incluir token en el encabezado
      })
    };

    const url = 'http://192.1.1.104:3000/list-labs'; // Actualiza la URL según tu backend

    // Llamada al servicio para obtener los datos del procedimiento almacenado
    this.http.get<any[]>(url, httpOptions).subscribe(
      response => {
        //console.log(response);
        
        // Obtener los datos de la respuesta y asignarlos al arreglo labOptions
        this.labOptions = response.map(usuario => ({ value: usuario.id, viewValue: usuario.description, url : usuario.image_url }));
        //console.log(this.labOptions);
        
      },
      error => {
        console.error(error);
      }
    );
  }

  // Función para guardar los datos del formulario
  onSave() {
    const token = localStorage.getItem('token');
    const  type_user = localStorage.getItem('type_user');
   

    if (this.form.valid) {
      // Obtener los valores del formulario
      const { lab, title, description, reportID, reportURL, reportToken } = this.form.value;
  
      if (!lab) {
        this.showSnackBarError('El campo Laboratorio es obligatorio');
        this.focusOnField('lab');
        return;
      }
      if (!title) {
        this.showSnackBarError('El campo Título es obligatorio');
        this.focusOnField('title');
        return;
      }
      if (!description) {
        this.showSnackBarError('El campo Descripción es obligatorio');
        this.focusOnField('description');
        return;
      }
      if (!reportID) {
        this.showSnackBarError('El campo ID del reporte es obligatorio');
        this.focusOnField('reportID');
        return;
      }
      if (!reportURL) {
        this.showSnackBarError('El campo URL del reporte es obligatorio');
        this.focusOnField('reportURL');
        return;
      }
      /*
      if (!reportToken) {
        this.showSnackBarError('El campo Token del reporte es obligatorio');
        this.focusOnField('reportToken');
        return;
      }*/
  
      const formData = {
        usuario_id: lab,
        id_report: reportID,
        url_report: reportURL,
        token_report: reportToken,
        title: title,
        description: description,
      };
      
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'User_Type': type_user || ''// Enviar el tipo de usuario en el encabezado
        })
      };
      if (token) {
        httpOptions.headers = httpOptions.headers.set('Authorization', token);
        console.log(httpOptions.headers);
      }


      // Enviar los datos del formulario al servidor Express
      this.http.post<any>('http://192.1.1.104:3000/guardar-post', formData, httpOptions).subscribe(
        response => {
          console.log('Formulario guardado exitosamente:', response);
          this.form.reset();
          // Realizar acciones adicionales si es necesario
          this.snackBar.open('Post publicado', 'Cerrar', {
            duration: 3000,
            panelClass: 'danger-toast',
          });
        },
        error => {
          console.error('Error al guardar el formulario:', error);
          // Manejar el error adecuadamente
          this.snackBar.open('Error al publicar post', 'Cerrar', {
            duration: 3000,
            panelClass: 'danger-toast',
          });
        }
      );
    }
  }
  
  showSnackBarError(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: 'danger-toast',
    });
  }
  
  focusOnField(fieldName: string) {
    const element = this.elementRef.nativeElement.querySelector(`[formControlName="${fieldName}"]`);
    if (element) {
      element.focus();
    }
  }

  closeModal() {
    this.dialogRef.close();
  }

}
