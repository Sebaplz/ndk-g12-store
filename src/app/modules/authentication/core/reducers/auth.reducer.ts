import {AuthStore} from '../../../../resources/stores';
import {createReducer, on} from '@ngrx/store';
import {authReaction} from '../../../../library/reactions';
import {authAction} from '../../../../global/actions/auth.action';

export const authInitialState: AuthStore = {
  loading: true,
  check: false,
  token: null,
  isAdmin: false,
  email: null,
  isLoggedIn: false,
  error: null,
}

export const authReducer = createReducer(
  authInitialState,
  on(authReaction.login,
    (): AuthStore =>
      (authInitialState)),
  on(authReaction.loginSuccess,
    (state, { token, isAdmin, email }): AuthStore =>
      ({ ...state, loading: false, email, token, check: true, isAdmin, isLoggedIn: true})),

  on(authReaction.loginFail,
    (state, { error }): AuthStore =>
      ({ ...state, loading: false, check: true, isAdmin: false, email: null, isLoggedIn: false, error })),

  on(authAction.loadToken,
    (): AuthStore =>
      (authInitialState)),

  on(authAction.loadTokenSuccess,
    (state, { token, isAdmin, email, isLoggedIn }): AuthStore =>
      ({ ...state, loading: false, token, check: true, isAdmin, email, isLoggedIn })),

  on(authAction.loadTokenFailure,
    (state): AuthStore =>
      ({ ...state, loading: false, check: true })),

  on(authAction.logout,
    (): AuthStore =>
      (authInitialState)),

  on(authReaction.register,
    (): AuthStore =>
      (authInitialState)),

  on(authReaction.registerSuccess,
    (state): AuthStore =>
      ({ ...state, loading: false, check: true })),

  on(authReaction.registerFail,
    (state, { error }): AuthStore =>
      ({ ...state, loading: false, check: true, error })),

  on(authAction.clearError, (state) => ({
    ...state,
    error: null,
  })),
);
