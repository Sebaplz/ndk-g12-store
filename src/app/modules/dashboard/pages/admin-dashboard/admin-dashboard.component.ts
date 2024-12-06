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
import {AddProductComponent} from '../../components/add-product/add-product.component';

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
    AddProductComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  productsStore = inject(Store<{ products: ProductsStore }>);
  products: Product[] = [];
  originalProducts: Product[] = [];
  loading: boolean = false;
  totalRecords: number = 0;

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

  showDialog() {
    this.visible = true;
  }

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadProducts()
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
      this.products = products.data;
      this.totalRecords = products.total;
      this.loading = products.loading;
      this.originalProducts = [...products.data];
    });
  }

  editProduct(product: Product) {
    console.log('Edit product', product);
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

        // Escucha el estado del store -> Esto esta medio raro
        this.productsStore.select(state => state.products).subscribe(products => {
          if (products.error) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: `Failed to delete the product: ${product.name}`
            });
          } else if (!products.loading) {
            this.messageService.add({
              severity: 'success',
              summary: 'Deletion Successful',
              detail: `Product "${product.name}" deleted successfully`
            });
          }
        });
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
    // Aquí puedes agregar lógica para enviar el producto al backend si es necesario
    this.products.push({ ...this.newProduct, id: this.products.length + 1 });
    console.log('Product saved:', this.newProduct);
    this.visible = false; // Cierra el modal después de guardar
    this.newProduct = {
      id: 0,
      name: '',
      image: '',
      description: '',
      price: 0,
      category: '',
      stock: 0,
    }; // Limpia el formulario
  }

}
