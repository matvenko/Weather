import type { User } from 'oidc-client-ts';

export interface AuthState {
  user?: User | null;

  isLoading: boolean;

  isAuthenticated: boolean;

  activeNavigator?:
    | 'signinRedirect'
    | 'signinResourceOwnerCredentials'
    | 'signinPopup'
    | 'signinSilent'
    | 'signoutRedirect'
    | 'signoutPopup'
    | 'signoutSilent';

  error?: Error;
}

export const initialAuthState: AuthState = {
  isLoading: true,
  isAuthenticated: false
};
