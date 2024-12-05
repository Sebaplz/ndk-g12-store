import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: 'dashboard/admin',
    loadComponent: () =>
      import('./pages/admin-dashboard/admin-dashboard.component')
        .then((c) => c.AdminDashboardComponent),
  },
  {
    path: 'dashboard/user',
    loadComponent: () =>
      import('./pages/user-dashboard/user-dashboard.component')
        .then((c) => c.UserDashboardComponent),
  },
  {
    path: '',
    redirectTo: 'dashboard/user',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class DashboardModule { }
