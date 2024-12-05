import {Component, inject, OnInit} from '@angular/core';
import {Button} from 'primeng/button';
import {CurrencyPipe, NgClass, NgForOf} from '@angular/common';
import {DataViewModule} from 'primeng/dataview';
import {PrimeTemplate} from 'primeng/api';
import {TagModule} from 'primeng/tag';
import {Product} from '../../core/utils/interfaces';
import {ProductsStore} from '../../../../resources/stores/products.store';
import {Store} from '@ngrx/store';
import {productsReaction} from '../../../../library/reactions/products.reaction';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [
    Button,
    CurrencyPipe,
    DataViewModule,
    NgForOf,
    PrimeTemplate,
    TagModule,
    NgClass
  ],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss'
})
export class UserDashboardComponent implements OnInit {
  productsStore = inject(Store<{ products: ProductsStore }>);

  products: Product[] = [];
  loading: boolean = false;
  totalRecords: number = 0;

  ngOnInit() {
    this.loadProducts();
    this.productsStore.select(state => state.products).subscribe(products => {
      this.products = products.data;
      this.totalRecords = products.total;
      this.loading = products.loading;
    });
  }

  loadProducts(page: number = 1, rows: number = 100) {
    this.productsStore.dispatch(productsReaction.load({page, limit: rows}));
  }

  getSeverity(stock: number): 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' | undefined {
    if (stock === 0) {
      return 'danger';
    } else if (stock >= 1 && stock <= 5) {
      return 'warning';
    } else {
      return 'success';
    }
  }
}
