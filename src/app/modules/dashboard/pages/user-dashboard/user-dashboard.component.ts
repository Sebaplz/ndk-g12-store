import {Component, inject, OnInit} from '@angular/core';
import {Button} from 'primeng/button';
import {AsyncPipe, CurrencyPipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {DataViewModule} from 'primeng/dataview';
import {PrimeTemplate, SelectItem} from 'primeng/api';
import {TagModule} from 'primeng/tag';
import {Product} from '../../core/utils/interfaces';
import {Store} from '@ngrx/store';
import {DropdownModule} from 'primeng/dropdown';
import {FormsModule} from '@angular/forms';
import {NavbarComponent} from '../../../../global/components/navbar/navbar.component';

import {Observable} from 'rxjs';
import {AuthStore, CartStore, ProductsStore} from '../../../../resources/stores';
import {productsReaction} from '../../../../library/reactions';
import {cartAction} from '../../../../global/actions';
import {SideBarCartComponent} from '../../components/side-bar-cart/side-bar-cart.component';

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
    NgClass,
    DropdownModule,
    FormsModule,
    NavbarComponent,
    AsyncPipe,
    SideBarCartComponent,
    NgIf
  ],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss'
})
export class UserDashboardComponent implements OnInit {
  productsStore = inject(Store<{ products: ProductsStore }>);
  authStore = inject(Store<{ auth: AuthStore }>);
  cartStore = inject(Store<{ cart: CartStore }>);
  isAdmin$: Observable<boolean> = this.authStore.select(state => state.auth.isAdmin);
  blockedProducts$ = this.cartStore.select(state => state.cart.blockedProducts);

  originalProducts: Product[] = [];
  products: Product[] = [];
  loading: boolean = false;
  totalRecords: number = 0;

  sortOptions: SelectItem[];
  sortKey: string = 'price';
  sortField: string = '';
  sortOrder: number = 1;

  categories: string[] = [];
  selectedCategory: string = '';

  ngOnInit() {
    this.loadProducts()
    this.extractCategories();
  }

  constructor() {
    this.sortOptions = [
      { label: 'Price High to Low', value: '!price' },
      { label: 'Price Low to High', value: 'price' }
    ];
  }

  //TODO: Esta bien suscribirme a la store?
  loadProducts(page: number = 1, rows: number = 100) {
    this.productsStore.dispatch(productsReaction.load({page, limit: rows}));
    this.productsStore.select(state => state.products).subscribe(products => {
      this.products = products.data;
      this.totalRecords = products.total;
      this.loading = products.loading;
      this.originalProducts = [...products.data];
      this.extractCategories();
    });
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

  onSortChange(event: any) {
    const value = event.value;

    // Crear una copia del arreglo para ordenar
    const sortedProducts = [...this.products];

    if (value === '!price') {
      // Ordenar de mayor a menor
      this.products = sortedProducts.sort((a, b) => b.price - a.price);
    } else if (value === 'price') {
      // Ordenar de menor a mayor
      this.products = sortedProducts.sort((a, b) => a.price - b.price);
    }
  }

  extractCategories() {
    this.categories = [...new Set(this.originalProducts.map(product => product.category))];
  }

  onCategoryChange() {
    // Filtrar productos por categoría
    if (this.selectedCategory) {
      this.products = this.originalProducts.filter(
        product => product.category === this.selectedCategory
      );
    } else {
      this.products = [...this.originalProducts];
    }
  }

  addProductToCart(product: Product) {
    this.cartStore.dispatch(cartAction.addProduct({ product }));
  }

  isProductBlocked(productId: number): boolean {
    let isBlocked = false;
    this.blockedProducts$.subscribe(blockedProducts => {
      isBlocked = blockedProducts.includes(productId);
    });
    return isBlocked;
  }
}
