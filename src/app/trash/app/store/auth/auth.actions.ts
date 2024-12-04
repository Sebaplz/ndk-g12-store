import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Login Request': props<{ email: string; password: string }>(),
    'Login Success': props<{
      user: {
        email: string;
        token: string;
        isAdmin: boolean;
      }
    }>(),
    'Login Failure': props<{ error: string }>(),
    'Logout': emptyProps()
  }
});
