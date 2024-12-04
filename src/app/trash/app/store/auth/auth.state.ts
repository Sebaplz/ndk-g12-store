export interface AuthState {
  user: {
    email: string | null;
    token: string | null;
    isAdmin: boolean;
  } | null;
  loading: boolean;
  error: string | null;
}

export const initialState: AuthState = {
  user: null,
  loading: false,
  error: null
};
