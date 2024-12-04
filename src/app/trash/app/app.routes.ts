import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/dashboard/pages/user/user.component')
      .then(m => m.UserComponent)
  },
  {
    path: 'auth',
    children:[
      {
        path: 'login',
        loadComponent: () => import('./features/auth/pages/login/login.component')
          .then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/pages/register/register.component')
          .then(m => m.RegisterComponent)
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/pages/admin/admin.component')
          .then(m => m.AdminComponent)
      }
    ]
  }
];
