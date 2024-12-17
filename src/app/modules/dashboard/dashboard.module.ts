import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {roleGuard} from '../../global/guards';
import {provideState} from '@ngrx/store';
import {cartReducer, ordersReducer, productReducer} from './core/reducers';
import {provideEffects} from '@ngrx/effects';
import {CartEffect, OrderEffect, ProductEffect} from '../../library/effects';

const routes: Routes = [
  {
    path: 'admin',
    loadComponent: () =>
      import('./pages/admin-dashboard/admin-dashboard.component')
        .then((c) => c.AdminDashboardComponent),
    canActivate: [roleGuard],
  },
  {
    path: '',
    loadComponent: () =>
      import('./pages/user-dashboard/user-dashboard.component')
        .then((c) => c.UserDashboardComponent),
  },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  providers:[
    provideState({
      name: 'products',
      reducer: productReducer,
    }),
    provideState({
      name: 'orders',
      reducer: ordersReducer,
    }),
    provideState({
      name: 'cart',
      reducer: cartReducer,
    }),
    provideEffects([
      ProductEffect, OrderEffect, CartEffect
    ]),
  ]
})
export class DashboardModule { }
