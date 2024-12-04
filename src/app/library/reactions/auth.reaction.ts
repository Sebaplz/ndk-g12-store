



import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const authReaction = createActionGroup({
  source: 'Auth Reactions',
  events: {
    'Login': props<{ rut: string, password: string}>(),
    'Login Success': props<{ token: string }>(),
    'Login Fail': props<{ error: any }>(),
  },
});
