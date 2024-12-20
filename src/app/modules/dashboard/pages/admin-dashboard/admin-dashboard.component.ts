import {Component, inject, OnInit} from '@angular/core';
import {NavbarComponent} from "../../../../global/components/navbar/navbar.component";
import {Button} from 'primeng/button';
import {CurrencyPipe} from '@angular/common';
import {IconFieldModule} from 'primeng/iconfield';
import {InputIconModule} from 'primeng/inputicon';
import {InputTextModule} from 'primeng/inputtext';
import {ConfirmationService, MessageService, PrimeTemplate} from 'primeng/api';
import {TableModule} from 'primeng/table';
import {TagModule} from 'primeng/tag';
import {Store} from '@ngrx/store';
import {ProductsStore} from '../../../../resources/stores/products.store';
import {productsReaction} from '../../../../library/reactions/products.reaction';
import {Product} from '../../core/utils/interfaces';
import {DropdownModule} from 'primeng/dropdown';
import {FormsModule} from '@angular/forms';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ToastModule} from 'primeng/toast';
import {OrdersComponent} from '../../components/orders/orders.component';
import {AddEditProductComponent} from '../../components/add-edit-product/add-edit-product.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    NavbarComponent,
    Button,
    CurrencyPipe,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    PrimeTemplate,
    TableModule,
    TagModule,
    DropdownModule,
    FormsModule,
    ConfirmDialogModule,
    ToastModule,
    OrdersComponent,
    AddEditProductComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  productsStore = inject(Store<{ products: ProductsStore }>);
  products: Product[] = [];
  loading: boolean = false;
  totalRecords: number = 0;
  originalProducts: Product[] = [];

  categories: string[] = [];
  selectedCategory: string = '';

  visible: boolean = false;
  newProduct: Product = {
    id: 0,
    name: '',
    image: '',
    description: '',
    price: 0,
    category: '',
    stock: 0,
  };

  selectedProduct: Product | null = null;

  showDialog() {
    this.visible = true;
  }

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadProducts()
    this.extractCategories();
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

  loadProducts(page: number = 1, rows: number = 100) {
    this.productsStore.dispatch(productsReaction.load({page, limit: rows}));
    this.productsStore.select(state => state.products).subscribe(products => {
      this.products = [...products.data];
      this.totalRecords = products.total;
      this.loading = products.loading;
      this.originalProducts = [...products.data];
      this.extractCategories();
    });
  }

  editProduct(product: Product): void {
    this.selectedProduct = product;
    this.visible = true;
  }

  updateProduct($event: Product): void {
    this.productsStore.dispatch(productsReaction.update({ product: $event }));
    this.visible = false;
    this.selectedProduct = null;
  }

  deleteProduct(product: Product) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the product "${product.name}"?`,
      header: 'Deletion Confirmation',
      icon: 'pi pi-info-circle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      acceptButtonStyleClass: "p-button-danger",
      rejectButtonStyleClass: "p-button-text",
      accept: () => {
        this.productsStore.dispatch(productsReaction.delete({ product }));
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelled',
          detail: `Deletion of "${product.name}" cancelled`
        });
      }
    });
  }


  saveProduct($event: Product) {
    this.productsStore.dispatch(productsReaction.add({ product: $event }));
    this.visible = false;
    this.newProduct = {
      id: 0,
      name: '',
      image: '',
      description: '',
      price: 0,
      category: '',
      stock: 0,
    };
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

  onClose() {
    this.visible = false;
    this.selectedProduct = null;
  }

}
