import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ElementRef } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { environment } from '../../environment'
import { group } from '@angular/animations';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent implements OnInit {
  labOptions: any[] = []; // Arreglo para almacenar las opciones de laboratorio
  groupOptions: any[] = []; // Arreglo para almacenar las opciones de grupo
  reportOptions: any[] = []; // Arreglo para almacenar las opciones de reporte

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

    const url = `${environment.apiUrl}/list-labs`; // Actualiza la URL según tu backend
    const url_group = `${environment.apiUrl}/list-group`; // Actualiza la URL según tu backend
    
    // Llamada al servicio para obtener los datos del procedimiento almacenado
    this.http.get<any[]>(url_group, httpOptions).subscribe(
      response => {
        this.groupOptions = response.map(group => ({ id: group.id, name: group.name }));
      },
      error => {
        console.error(error);
      }
    );

    this.http.get<any[]>(url, httpOptions).subscribe(
      response => {
        this.labOptions = response.map(usuario => ({ value: usuario.id, viewValue: usuario.description, url : usuario.image_url }));
      },
      error => {
        console.error(error);
      }
    );
  }

  // Método para obtener las opciones de reporte según el grupo seleccionado
  fetchReportOptions(idGrupo: string) {
    const token = localStorage.getItem('token');
    const type_user = localStorage.getItem('type_user');
    const httpOptions = { 
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'User_Type': type_user || '', // Enviar el tipo de usuario en el encabezado
        'Authorization': token || '' // Incluir token en el encabezado
      })
    };

    const url = `${environment.apiUrl}/obtener-reportes/${idGrupo}`; // Actualiza la URL según tu backend
    
    // Llamada al servicio para obtener los datos de los reportes
    this.http.get<any[]>(url, httpOptions).subscribe(
      response => {
        this.reportOptions = response.map(report => ({
          id: report.id,
          name: report.name,
          embedUrl: report.embedUrl
        }));
      },
      error => {
        console.error('Error obteniendo los informes de Power BI:', error);
        // Manejar el error adecuadamente
      }
    );
  }

  // Evento que se ejecuta al cambiar la selección de grupo
  onLabSelectionChange(labId: string) {
    if (labId) {
      this.fetchReportOptions(labId);
    } else {
      this.reportOptions = [];
    }
  }

  onSave() {
    const token = localStorage.getItem('token');
    const type_user = localStorage.getItem('type_user');

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
  
      const formData = {
        usuario_id: lab,
        id_report: reportID,
        url_report: reportURL,
        token_report: "Null",
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

      this.http.post<any>(`${environment.apiUrl}/guardar-post`, formData, httpOptions).subscribe(
        response => {
          console.log('Formulario guardado exitosamente:', response);
          this.form.reset();
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
