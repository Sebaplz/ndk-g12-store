import {inject, Injectable} from '@angular/core';
import {environment} from '../../../environments/environment.development';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {productsReaction} from '../reactions/products.reaction';
import {catchError, map, of, switchMap} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Product, ProductResponse, ProductsResponse} from '../../modules/dashboard/core/utils/interfaces';
import {MessageService} from 'primeng/api';

@Injectable()
export class ProductEffect {
  private readonly API_URL = environment.apiUrl;
  private readonly actions$ = inject(Actions);
  private readonly http = inject(HttpClient);
  private readonly messageService = inject(MessageService);

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

  addProduct$ = createEffect(() =>
      this.actions$.pipe(
        ofType(productsReaction.add),
        switchMap((action) => {
          return this.http.post<Product>(`${this.API_URL}/products`, action.product).pipe(
            map((response: ProductResponse) =>
              productsReaction.addSuccess({ productResponse: response })
            ),
            catchError((err) => {
              console.error('Error during add:', err.error);
              return of(productsReaction.addFail({ error: err.error }));
            })
          );
        })
      ),
    { functional: true }
  );

  updateProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(productsReaction.update),
      switchMap((action) => {
        const { id, ...productData } = action.product;
        return this.http.patch<Product>(`${this.API_URL}/products/${id}`, productData).pipe(
          map((updatedProduct: ProductResponse) =>
            productsReaction.updateSuccess({ productResponse: updatedProduct })
          ),
          catchError(error => of(productsReaction.updateFail({ error })))
        );
      })
    )
  );

  addProductFeedback$ = createEffect(() =>
      this.actions$.pipe(
        ofType(productsReaction.addSuccess, productsReaction.addFail),
        map(action => {
          if (action.type === '[Products Reactions] Add Success') {
            this.messageService.add({
              severity: 'success',
              summary: 'Add Product Success',
              detail: `Product "${action.productResponse.name}" added successfully.`,
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Add Product Failed',
              detail: `An error occurred while adding the product.`,
            });
          }
        })
      ),
    { dispatch: false }
  );

  deleteProductFeedback$ = createEffect(() =>
      this.actions$.pipe(
        ofType(productsReaction.deleteSuccess, productsReaction.deleteFail),
        map(action => {
          if (action.type === '[Products Reactions] Delete Success') {
            this.messageService.add({
              severity: 'success',
              summary: 'Delete Product Success',
              detail: `Product deleted successfully.`,
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Delete Product Failed',
              detail: `An error occurred while deleting the product.`,
            });
          }
        })
      ),
    { dispatch: false }
  );

  updateProductFeedback$ = createEffect(() =>
      this.actions$.pipe(
        ofType(productsReaction.updateSuccess, productsReaction.updateFail),
        map(action => {
          if (action.type === '[Products Reactions] Update Success') {
            this.messageService.add({
              severity: 'success',
              summary: 'Update Successful',
              detail: `Product "${action.productResponse.name}" updated successfully.`,
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Update Failed',
              detail: `An error occurred while updating the product.`,
            });
          }
        })
      ),
    { dispatch: false }
  );
}
