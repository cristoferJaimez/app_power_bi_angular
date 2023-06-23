import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../environment'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  isLoggedIn: boolean = false;
  rememberPassword: boolean = false;

  constructor(private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,) { }

  ngOnInit() {
    // Verificar si ya existe un token en el almacenamiento local
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      this.isLoggedIn = true; // Establecer como autenticado
      this.router.navigate(['/dashboard']);
    }
  }

  login() {

   

    this.http.post(`http://${environment.apiUrl}/login/`, { username: this.username, password: this.password }).subscribe(
      (response: any) => {
        const token = response.token;
        const id_user = response.usuarioId;
        const descripcion = response.descripcion;
        const url = response.imagenUrl;
        const type_user = response.tipoUsuario;

        //console.log(response);

        if (this.rememberPassword) {
          // Si se selecciona "Recordar contraseña", realiza alguna acción
        }

        // Verificar si el token es válido o vigente (ejemplo de lógica)

        const storedToken = localStorage.getItem('token');

        if (token || storedToken) {
          // Guardar el token en el localStorage
          localStorage.setItem('token', token || storedToken);
          localStorage.setItem('id', id_user);
          localStorage.setItem('description', descripcion);
          localStorage.setItem('url', url);
          localStorage.setItem('type_user', type_user);

          this.isLoggedIn = true; // Establecer como autenticado

          // Redirigir según el tipo de usuario
          if (type_user === 'admin') {
            this.router.navigate(['/dashboard-admin']);
          } else if (type_user === 'user') {
            this.router.navigate(['/dashboard']);
          } else {
            // Tipo de usuario desconocido, manejar el caso según tus necesidades
          }

          // Mostrar notificación de éxito
          this.snackBar.open('Inicio de sesión exitoso', 'Cerrar', {
            duration: 3000, // Duración en milisegundos
          });
        } else {
          // Manejar el caso en el que el token no sea válido o vigente
          this.snackBar.open('Credenciales inválidas', 'Cerrar', {
            duration: 3000, // Duración en milisegundos
          });
        }
      },
      (error) => {
        console.error('Error en la petición:', error);
        // Manejar el error en caso de que la autenticación falle
        this.snackBar.open('Credenciales inválidas', 'Cerrar', {
          duration: 3000, // Duración en milisegundos
        });
      }
    );
  }
}
