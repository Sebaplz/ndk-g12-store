import {Component, inject, OnInit} from '@angular/core';
import {Product} from '../../../../core/interfaces/products.interface';
import {CurrencyPipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {IconFieldModule} from 'primeng/iconfield';
import {InputIconModule} from 'primeng/inputicon';
import {InputTextModule} from 'primeng/inputtext';
import {NavbarComponent} from '../../../../components/navbar/navbar.component';
import {PrimeTemplate} from 'primeng/api';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {TableModule} from 'primeng/table';
import {TagModule} from 'primeng/tag';
import {ProductUtilsService} from '../../../../core/services/product-utils.service';
import {DataViewModule} from 'primeng/dataview';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-user-dashboard',
  imports: [CurrencyPipe, IconFieldModule, InputIconModule, InputTextModule, NavbarComponent, NgIf, PrimeTemplate, ProgressSpinnerModule, TableModule, TagModule, DataViewModule, NgForOf, NgClass, Button],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  standalone: true
})
export class UserComponent implements OnInit {
  private productUtilsService = inject(ProductUtilsService);

  layout: string = 'list';
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
}
