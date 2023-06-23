import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { environment } from '../../environment'

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit {
  formulario: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private http: HttpClient,
    public dialogRef: MatDialogRef<NewUserComponent>
  ) {
    this.formulario = this.formBuilder.group({
      nombre: ['', Validators.required],
      contraseña: ['', Validators.required],
      repetirContraseña: ['', Validators.required],
      url: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      tipoUsuario: ['', Validators.required],
      descripcion: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  save() {
    const token = localStorage.getItem('token');
    const  type_user = localStorage.getItem('type_user');
   
      
    if (this.formulario.valid) {
      // Guardar el formulario

      // Obtener los valores del formulario
      const nombre = this.formulario.get('nombre')?.value;
      const contraseña = this.formulario.get('contraseña')?.value;
      const repetirContraseña = this.formulario.get('repetirContraseña')?.value;
      const url = this.formulario.get('url')?.value;
      const email = this.formulario.get('email')?.value;
      const tipoUsuario = this.formulario.get('tipoUsuario')?.value;
      const descripcion = this.formulario.get('descripcion')?.value;

      // Crear el objeto de datos para enviar en la solicitud
      const data = {
        nombre,
        contraseña,
        descripcion,
        rol_id: tipoUsuario === 'admin' ? 1 : 2,
        url,
        email
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

      // Enviar la solicitud POST al servidor
      this.http.post(`http://${environment.apiUrl}/new-user`, data, httpOptions ).subscribe(
        () => {
          // Éxito: mostrar mensaje de éxito
          this.snackBar.open('Formulario guardado correctamente', 'Cerrar', {
            duration: 2000
          });
          this.formulario.reset();
        },
        (error) => {
          // Error: mostrar mensaje de error
          console.error('Error al guardar el formulario:', error);
          this.snackBar.open('Error al guardar el formulario', 'Cerrar', {
            duration: 2000
          });
        }
      );
    } else {
      // Mostrar mensaje de error
      this.snackBar.open('Completa todos los campos correctamente', 'Cerrar', {
        duration: 2000
      });
    }
  }

  closeModal() {
    this.dialogRef.close();
  }
}
