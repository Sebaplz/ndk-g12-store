import {AuthStore} from '../../../../resources/stores';
import {createReducer, on} from '@ngrx/store';
import {authReaction} from '../../../../library/reactions';
import {authAction} from '../../../../global/actions';


export const authInitialState: AuthStore = {
  loading: true,
  check: false,
  token: null,
  isAdmin: false,
  email: null,
  isLoggedIn: false,
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
    (state): AuthStore =>
      ({ ...state, loading: false, check: true, isAdmin: false, email: null, isLoggedIn: false })),

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

);
