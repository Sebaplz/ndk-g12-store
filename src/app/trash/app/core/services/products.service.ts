import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {DeleteProductResponse, Product, ProductsResponse} from '../interfaces/products.interface';

@Injectable()
export class ProductsService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getProducts(page: number = 1, limit: number = 100): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(`${this.API_URL}/products?page=${page}&limit=${limit}`);
  }

  deleteProduct(product: Product): Observable<DeleteProductResponse> {
    return this.http.delete(`${this.API_URL}/products/${product.id}`, {
      responseType: 'text'
    }).pipe(
      map((response: string) => {
        return {text: response} as DeleteProductResponse;
      })
    );
  }
}
