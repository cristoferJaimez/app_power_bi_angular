import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Componentes
import { LoginComponent } from '../app/components/login/login.component';
import { DashboardComponent } from '../app/components/dashboard/dashboard.component';
import { DashboardAdminComponent } from '../app/components/dashboard-admin/dashboard-admin.component';
import { NewUserComponent }  from '../app/components/new-user/new-user.component';
import { NewPostComponent }  from '../app/components/new-post/new-post.component';
import { ViewPostComponent } from '../app/components/view-post/view-post.component';
import { ViewUsersComponent } from '../app/components/view-users/view-users.component';
import { UpdatePostComponent } from '../app/components/update-post/update-post.component';
import { UpdateUsersComponent } from '../app/components/update-users/update-users.component';
import { GroupUserComponent } from '../app/components/group-user/group-user.component';
import { InfoUserComponent } from '../app/components/info-user/info-user.component';
import { EditUserComponent } from '../app/components/edit-user/edit-user.component';
import { LogComponent } from '../app/components/log/log.component';



const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Ruta raíz redirige a /login
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'dashboard-admin', component: DashboardAdminComponent },
  { path: 'new-user', component: NewUserComponent },
  { path: 'new-post', component: NewPostComponent },
  { path: 'view-post', component: ViewPostComponent },
  { path: 'view-users', component: ViewUsersComponent },
  { path: 'update-post', component: UpdatePostComponent },
  { path: 'update-users', component: UpdateUsersComponent },
  { path: 'group-user', component: GroupUserComponent },
  { path: 'edit-user', component: EditUserComponent },
  { path: 'info-user', component: InfoUserComponent },
  { path: 'log', component: LogComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
