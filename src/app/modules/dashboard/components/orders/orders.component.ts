import {Component, inject, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {OrderStore} from '../../../../resources/stores';
import {AsyncPipe} from '@angular/common';
import {ordersReaction} from '../../../../library/reactions';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    AsyncPipe
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {
  orderStore = inject(Store<{ orders: OrderStore }>);
  totalOrders$ = this.orderStore.select(state => state.orders.meta.total);

  ngOnInit(): void {
    this.orderStore.dispatch(ordersReaction.load());
  }
}
