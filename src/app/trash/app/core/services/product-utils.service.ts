import { Injectable } from '@angular/core';
import { ProductsService } from './products.service';
import { Product } from '../interfaces/products.interface';
import { Observable } from 'rxjs';

@Injectable()
export class ProductUtilsService {
  constructor(private productsService: ProductsService) {}

  getSeverity(stock: number): 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' | undefined {
    if (stock === 0) {
      return 'danger';
    } else if (stock >= 1 && stock <= 5) {
      return 'warning';
    } else {
      return 'success';
    }
  }

  loadProducts(page: number, rows: number): Observable<{ data: Product[]; total: number }> {
    return this.productsService.getProducts(page, rows);
  }

}
