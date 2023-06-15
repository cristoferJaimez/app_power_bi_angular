  import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
  import { BrowserModule } from '@angular/platform-browser';
  import { FormsModule } from '@angular/forms';
  import { MatCardModule } from '@angular/material/card';
  import { MatFormFieldModule } from '@angular/material/form-field';
  import { MatInputModule } from '@angular/material/input';
  import { MatButtonModule } from '@angular/material/button';
  import { MatCheckboxModule } from '@angular/material/checkbox';
  import { MatIconModule } from '@angular/material/icon';
  import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
  import { HttpClientModule } from '@angular/common/http';
  import { MatDividerModule } from '@angular/material/divider';
  import { MatDialogModule } from '@angular/material/dialog';
  import { PowerBIEmbedModule } from 'powerbi-client-angular';
  import { ToastrModule } from 'ngx-toastr';
  import { MatSnackBarModule } from '@angular/material/snack-bar';
  import { ReactiveFormsModule } from '@angular/forms';
  import { MatSelectModule } from '@angular/material/select';



  import { AppRoutingModule } from './app-routing.module';
  import { AppComponent } from './app.component';
  import { LoginComponent } from '../app/components/login/login.component';
  import { DashboardComponent } from '../app/components/dashboard/dashboard.component';
  import { DashboardAdminComponent } from '../app/components/dashboard-admin/dashboard-admin.component';
  import { NewUserComponent } from '../app/components/new-user/new-user.component';
  import { NewPostComponent } from '../app/components/new-post/new-post.component';
  import { ModalViewsComponent } from '../app/components/modal-views/modal-views.component';
import { ViewPostComponent } from './components/view-post/view-post.component';
import { ViewUsersComponent } from './components/view-users/view-users.component';
import { Error404Component } from './components/error404/error404.component';
import { Error500Component } from './components/error500/error500.component';


  @NgModule({
    declarations: [
      AppComponent,
      LoginComponent,
      DashboardComponent,
      DashboardAdminComponent,
      NewUserComponent,
      NewPostComponent,
      ModalViewsComponent,
      ViewPostComponent,
      ViewUsersComponent,
      Error404Component,
      Error500Component,
      
    ],
    imports: [
      BrowserModule,
      BrowserAnimationsModule,
      FormsModule,
      MatCardModule,
      MatInputModule,
      MatButtonModule,
      MatFormFieldModule,
      MatCheckboxModule,
      MatIconModule,
      MatDividerModule,
      MatDialogModule,
      AppRoutingModule,
      HttpClientModule,
      PowerBIEmbedModule,
      ToastrModule.forRoot(),
      MatSnackBarModule,
      ReactiveFormsModule,
      MatSelectModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  })

  
  export class AppModule { }
