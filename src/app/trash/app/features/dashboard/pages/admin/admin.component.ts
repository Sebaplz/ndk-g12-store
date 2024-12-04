import {Component, inject, OnInit} from '@angular/core';
import {Product} from '../../../../core/interfaces/products.interface';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {NavbarComponent} from '../../../../components/navbar/navbar.component';
import {TableModule} from 'primeng/table';
import {IconFieldModule} from 'primeng/iconfield';
import {InputIconModule} from 'primeng/inputicon';
import {TagModule} from 'primeng/tag';
import {ProductUtilsService} from '../../../../core/services/product-utils.service';
import {CurrencyPipe} from '@angular/common';
import {InputTextModule} from 'primeng/inputtext';
import {Button} from 'primeng/button';
import {ProductsService} from '../../../../core/services/products.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import {OrdersComponent} from '../../../../components/orders/orders.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [ProgressSpinnerModule, NavbarComponent, TableModule, IconFieldModule, InputIconModule, TagModule, CurrencyPipe, InputTextModule, Button, ToastModule, ConfirmDialogModule, OrdersComponent],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  private productUtilsService = inject(ProductUtilsService);
  private productsService = inject(ProductsService);

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  products: Product[] = [];
  loading: boolean = false;
  totalRecords: number = 0;
  rows: number = 100;
  page: number = 1;

  ngOnInit() {
    this.loadProducts(this.page, this.rows);
  }

  loadProducts(page: number, rows: number) {
    this.loading = true;
    this.productUtilsService.loadProducts(page, rows).subscribe({
      next: (response) => {
        this.products = response.data;
        this.totalRecords = response.total;
        this.loading = false;
      },
      error: () => {
        console.error('Failed to load products');
        this.loading = false;
      },
    });
  }

  getSeverity(stock: number) {
    return this.productUtilsService.getSeverity(stock);
  }

  editProduct(product: Product) {
    console.log('Edit product:', product);
    // Implementar lógica de edición
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
        this.productsService.deleteProduct(product).subscribe({
          next: () => {
            this.products = this.products.filter(p => p.id !== product.id);
            this.totalRecords = this.products.length;
            this.messageService.add({
              severity: 'success',
              summary: 'Deletion Successful',
              detail: `Product "${product.name}" deleted successfully`
            });
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: `Failed to delete the product: ${error.message}`
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
}
