



import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const authAction = createActionGroup({
  source: 'Auth Actions',
  events: {
    'Logout': emptyProps(),

    'Load Token': emptyProps(),
    'Load Token Success': props<{ token: string, isAdmin: boolean, email: string, isLoggedIn: boolean }>(),
    'Load Token Failure': props<{ error: any }>(),
  },
});
