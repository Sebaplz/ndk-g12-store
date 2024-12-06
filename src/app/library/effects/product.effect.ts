import {inject, Injectable} from '@angular/core';
import {environment} from '../../../environments/environment.development';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {productsReaction} from '../reactions/products.reaction';
import {catchError, map, of, switchMap} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ProductsResponse} from '../../modules/dashboard/core/utils/interfaces';

@Injectable()
export class ProductEffect {
  private readonly API_URL = environment.apiUrl;
  private readonly actions$ = inject(Actions);
  private readonly http = inject(HttpClient);

  constructor() {}

  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(productsReaction.load),
      switchMap((action) => {
        return this.http.get<ProductsResponse>(`${this.API_URL}/products?page=${action.page}&limit=${action.limit}`).pipe(
          map(response => {
            return productsReaction.loadSuccess({
              products: response.data,
              total: response.total,
              page: response.page,
              limit: response.limit,
            });
          }),
          catchError(err => {
            return of(productsReaction.loadFail({error: err}));
          })
        );
      })
    ),
    { functional: true }
  );

  deleteProduct$ = createEffect(() =>
      this.actions$.pipe(
        ofType(productsReaction.delete),
        switchMap((action) => {
          return this.http.delete(`${this.API_URL}/products/${action.product.id}`, { responseType: 'text' }).pipe(
            map(() => productsReaction.deleteSuccess({productId: action.product.id})),
            catchError((err) => {
              console.error('Error during delete:', err.error);
              return of(productsReaction.deleteFail({ error: err.error }));
            })
          );
        })
      ),
    { functional: true }
  );
}
