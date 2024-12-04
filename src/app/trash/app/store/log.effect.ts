import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

@Injectable()
export class DebugEffects {
  logActions$ = createEffect(
    () =>
      this.actions$.pipe(
        tap(action => console.log('Action dispatched:', action))
      ),
    { dispatch: false } // No despacha ninguna acción de retorno
  );

  constructor(private actions$: Actions) {}
}
