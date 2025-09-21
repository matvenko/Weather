import type { User } from 'oidc-client-ts';

import type { AuthState } from '../AuthState';

type Action =
  | { type: 'INITIALISED' | 'USER_LOADED'; user: User | null }
  | { type: 'USER_UNLOADED' }
  | { type: 'USER_SIGNED_OUT' }
  | {
      type: 'NAVIGATOR_INIT';
      method: NonNullable<AuthState['activeNavigator']>;
    }
  | { type: 'NAVIGATOR_CLOSE' }
  | { type: 'ERROR'; error: Error };

export const authReducer = (state: AuthState, action: Action): AuthState => {
  switch (action.type) {
    case 'INITIALISED':
    case 'USER_LOADED':
      return {
        ...state,
        user: action.user,
        isLoading: false,
        isAuthenticated: action.user ? !action.user.expired : false,
        error: undefined
      };
    case 'USER_SIGNED_OUT':
    case 'USER_UNLOADED':
      return {
        ...state,
        user: undefined,
        isAuthenticated: false
      };
    case 'NAVIGATOR_INIT':
      return {
        ...state,
        isLoading: true,
        activeNavigator: action.method
      };
    case 'NAVIGATOR_CLOSE':
      return {
        ...state,
        isLoading: false,
        activeNavigator: undefined
      };
    case 'ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.error
      };
    default:
      return {
        ...state,
        isLoading: false,
        error: new Error(`unknown type ${action['type'] as string}`)
      };
  }
};
