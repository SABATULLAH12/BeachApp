import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { HomeComponent } from './Components/home/home.component';
import { UserManagementComponent } from './Components/user-management/user-management.component';

const routes: Routes = [
  { path: 'UserManagement', component: UserManagementComponent },
  {
    path: '**',
    component: HomeComponent,
    pathMatch: 'full'
  },

  // { path: '', component: HomeComponent, },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
