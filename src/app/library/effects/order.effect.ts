import {inject, Injectable} from '@angular/core';
import {environment} from '../../../environments/environment.development';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {HttpClient} from '@angular/common/http';
import {ordersReaction} from '../reactions';
import {of, switchMap} from 'rxjs';
import {OrderList} from '../../modules/dashboard/core/utils/interfaces';
import {catchError, map} from 'rxjs/operators';

@Injectable()
export class OrderEffect {
  private readonly API_URL = environment.apiUrl;
  private readonly actions$ = inject(Actions);
  private readonly http = inject(HttpClient);

  constructor() {}

  loadOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ordersReaction.load),
      switchMap(() => {
        return this.http.get<OrderList>(`${this.API_URL}/orders`).pipe(
          map(response => {
            return ordersReaction.loadSuccess({
              orders: response.data,
              total: response.meta.total,
              page: response.meta.page,
              lastPage: response.meta.lastPage,
            });
          }),
          catchError(err => {
            return of(ordersReaction.loadFail({error: err}));
          })
        );
      })
    ),
    { functional: true }
  );
}
