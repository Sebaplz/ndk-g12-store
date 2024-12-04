import { createReducer, on } from '@ngrx/store';
import { AuthActions } from './auth.actions';
import { initialState } from './auth.state';

export const authReducer = createReducer(
  initialState,
  on(AuthActions.loginRequest, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AuthActions.loginSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
    error: null
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    user: null,
    loading: false,
    error
  })),
  on(AuthActions.logout, () => initialState)
);
