import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {OrderResponse} from '../interfaces/orders.interface';

@Injectable()
export class OrdersService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getOrders(page: number = 1, limit: number = 100): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.API_URL}/orders?page=${page}&limit=${limit}`).pipe(
      catchError(error => {
        console.error('Error fetching orders:', error);
        return throwError(() => new Error('Failed to fetch orders. Please try again.'));
      })
    );
  }
}
