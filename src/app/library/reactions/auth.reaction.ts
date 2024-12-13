



import {createActionGroup, emptyProps, props} from '@ngrx/store';

export const authReaction = createActionGroup({
  source: 'Auth Reactions',
  events: {
    'Login': props<{ email: string, password: string}>(),
    'Login Success': props<{ email: string, token: string, isAdmin: boolean }>(),
    'Login Fail': props<{ error: any }>(),

    'Register': props<{ email: string, password: string }>(),
    'Register Success': emptyProps(),
    'Register Fail': props<{ error: any }>(),
  },
});
