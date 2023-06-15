  import { NgModule } from '@angular/core';
  import { RouterModule, Routes } from '@angular/router';

  //componentes
  import { LoginComponent } from '../app/components/login/login.component';
  import { DashboardComponent } from '../app/components/dashboard/dashboard.component';
  import { DashboardAdminComponent } from '../app/components/dashboard-admin/dashboard-admin.component';
  import { NewUserComponent }  from '../app/components/new-user/new-user.component';
  import { NewPostComponent }  from '../app/components/new-post/new-post.component'
  import { ViewPostComponent } from '../app/components/view-post/view-post.component'
  import { ViewUsersComponent } from '../app/components/view-users/view-users.component'

  const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' }, // Ruta raíz redirige a /login
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'dashboard-admin', component: DashboardAdminComponent },
    { path: 'new-user', component: NewUserComponent },
    { path: 'new-post', component: NewPostComponent },
    { path: 'view-post', component: ViewPostComponent },
    { path: 'view-users', component: ViewUsersComponent },
  ];

  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
