import {AuthStore} from '../../../../resources/stores/auth.store';
import {createReducer, on} from '@ngrx/store';
import {authReaction} from '../../../../library/reactions/auth.reaction';
import {authAction} from '../../../../global/actions/auth.action';


export const authInitialState: AuthStore = {
  loading: true,
  check: false,
  token: null,
  isAdmin: false,
  email: null,
}

export const authReducer = createReducer(
  authInitialState,
  on(authReaction.login,
    (): AuthStore =>
      (authInitialState)),
  on(authReaction.loginSuccess,
    (state, { token, isAdmin, email }): AuthStore =>
      ({ ...state, loading: false, email, token, check: true, isAdmin})),

  on(authReaction.loginFail,
    (state): AuthStore =>
      ({ ...state, loading: false, check: true, isAdmin: false, email: null })),

  on(authAction.loadToken,
    (): AuthStore =>
      (authInitialState)),

  on(authAction.loadTokenSuccess,
    (state, { token }): AuthStore =>
      ({ ...state, loading: false, token, check: true })),

  on(authAction.loadTokenFailure,
    (state): AuthStore =>
      ({ ...state, loading: false, check: true })),

  on(authAction.logout,
    (): AuthStore =>
      (authInitialState)),

);
