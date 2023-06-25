import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-group-user',
  templateUrl: './group-user.component.html',
  styleUrls: ['./group-user.component.css']
})
export class GroupUserComponent implements OnInit {
  usuario: string = '';
  contrasena: string = '';
  email: string = '';
  descripcion: string = '';
  imageUrl: string = '';
  status: number = 0;
  usuarioId: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<GroupUserComponent>,
    private snackBar: MatSnackBar,
  ) {}

  closeModal() {
    this.dialogRef.close();
  }

  save() {
    if (
      
      this.usuario.trim() === '' ||
      this.contrasena.trim() === '' ||
      this.email.trim() === '' ||
      this.descripcion.trim() === '' ||
      this.imageUrl.trim() === ''
      
    ) {
      // Al menos uno de los campos está vacío, mostrar mensaje de error o realizar la lógica necesaria
      this.snackBar.open('Error: Todos los campos deben estar llenos', 'Cerrar', {
        duration: 3000,
        panelClass: 'danger-toast'
      });
      //console.log('Error: Todos los campos deben estar llenos');
      return;
    }

    // Todos los campos están llenos, realizar la lógica de guardar aquí
    this.snackBar.open('Guardando los datos:', 'Cerrar', {
      duration: 3000,
      panelClass: 'danger-toast'
    });
    console.log('Guardando los datos:', this.usuario, this.contrasena, this.email, this.descripcion, this.imageUrl, this.status, this.usuarioId);
  }

  ngOnInit(): void {
    this.usuarioId = this.data.userId;
    console.log('ID de usuario recibido:', this.usuarioId);
  }
}
