import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment';
import { ReportModalService } from '../../services/report-modal.service'; // Import the PostService
import { MatSnackBar } from '@angular/material/snack-bar'; 

@Component({
  selector: 'app-update-post',
  templateUrl: './update-post.component.html',
  styleUrls: ['./update-post.component.css']
})
export class UpdatePostComponent implements OnInit {
  form!: FormGroup;
  labOptions: any[] = [];
  postData: any; // Declare the postData variable here

  constructor(
    public dialogRef: MatDialogRef<UpdatePostComponent>,
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: { postId: string },
    private postService: ReportModalService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.buildForm();
    this.loadPostData();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      reportID: ['', Validators.required],
      reportURL: ['', Validators.required]
    });
  }

  loadPostData() {
    const postId = this.data.postId;

    this.httpClient.get<any>(`${environment.apiUrl}/posts/${postId}`).subscribe(
      (response) => {
        this.postData = response; // Assign the response to postData
       // console.log(this.postData);

        this.form.patchValue({
          title: this.postData.title,
          name: this.postData.name,
          description: this.postData.description,
          reportID: this.postData.id_report,
          reportURL: this.postData.url_report,
          image_url: this.postData.image_url
        });

        this.labOptions = this.postData.labOptions;
      },
      (error) => {
        console.error('Error al cargar los datos del post', error);
      }
    );
  }

  closeModal() {
    this.dialogRef.close();
  }

  onCancel() {
    this.closeModal();
  }

  onSave() {
    if (this.form.valid) {
      const postId = this.data.postId;
      const { title, description, reportID, reportURL } = this.form.value;
  
      const confirmed = window.confirm('¿Estás seguro de que deseas guardar los cambios?');
      if (confirmed) {
        const apiUrl = `${environment.apiUrl}/update-post`;
        const requestBody = {
          postId: postId,
          title: title,
          description: description,
          reportId: reportID,
          reportUrl: reportURL
        };
  
        this.httpClient.post(apiUrl, requestBody).subscribe(
          (response) => {
            console.log('Datos actualizados en la tabla post');
            this.postService.setPost(requestBody);
            this.closeModal();
            this.snackBar.open('Los cambios se han guardado correctamente.', 'Cerrar', {
              duration: 3000
            });
          },
          (error) => {
            console.error('Error al actualizar los datos en la tabla post', error);
            this.snackBar.open('Error al guardar los cambios. Por favor, inténtalo nuevamente.', 'Cerrar', {
              duration: 3000
            });
          }
        );
      }
    } else {
      console.log('Formulario no válido');
    }
  }
}
