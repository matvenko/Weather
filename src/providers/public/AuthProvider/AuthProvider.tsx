import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import {
  UserManager,
  type UserManagerSettings,
  type UserManagerEvents,
  type User,
  type SessionStatus,
  type SigninResourceOwnerCredentialsArgs,
  type SigninPopupArgs,
  type SigninSilentArgs,
  type SigninRedirectArgs,
  type SignoutRedirectArgs,
  type SignoutPopupArgs,
  type QuerySessionStatusArgs,
  type RevokeTokensTypes,
  type SignoutSilentArgs,
} from "oidc-client-ts";

import { AuthContext } from "./AuthContext";
import { initialAuthState } from "./AuthState";
import { authReducer } from "./reducers/authReducer";
import { hasAuthParams, signinError } from "./utils";
import privateAxios from "../../../api/privateAxios";

// ---------- Props ----------
export interface AuthProviderBaseProps {
  children?: React.ReactNode;
  onSigninCallback?: (user: User | void) => Promise<void> | void;
  skipSigninCallback?: boolean;
  onRemoveUser?: () => Promise<void> | void;
}
export interface AuthProviderNoUserManagerProps
    extends AuthProviderBaseProps,
        UserManagerSettings {
  userManager?: never;
}
export interface AuthProviderUserManagerProps extends AuthProviderBaseProps {
  userManager?: UserManager;
}
export type AuthProviderProps =
    | AuthProviderNoUserManagerProps
    | AuthProviderUserManagerProps;

// ---------- helpers ----------
const userManagerContextKeys = [
  "clearStaleState",
  "querySessionStatus",
  "revokeTokens",
  "startSilentRenew",
  "stopSilentRenew",
] as const;

const unsupportedEnvironment = (fnName: string) => () => {
  throw new Error(
      `UserManager#${fnName} was called from an unsupported context. If this is a server-rendered page, defer this call with useEffect() or pass a custom UserManager implementation.`
  );
};

const UserManagerImpl = typeof window === "undefined" ? null : UserManager;

// ზუსტი სიგნატურები, რომ Context-ს პირისპირ დაემთხვეს
type CtxMethods = {
  clearStaleState: () => Promise<void>;
  querySessionStatus: (args?: QuerySessionStatusArgs) => Promise<SessionStatus | null>;
  revokeTokens: (types?: RevokeTokensTypes) => Promise<void>;
  startSilentRenew: () => void;
  stopSilentRenew: () => void;
};

type NavMethods = {
  signinPopup: (args?: SigninPopupArgs) => Promise<User>;
  signinSilent: (args?: SigninSilentArgs) => Promise<User | null>;
  signinRedirect: (args?: SigninRedirectArgs) => Promise<void>;
  signinResourceOwnerCredentials: (
      args: SigninResourceOwnerCredentialsArgs
  ) => Promise<User>;
  signoutPopup: (args?: SignoutPopupArgs) => Promise<void>;
  signoutRedirect: (args?: SignoutRedirectArgs) => Promise<void>;
  signoutSilent: (args?: SignoutSilentArgs) => Promise<void>;
};

// ---------- Component ----------
export const AuthProvider = (props: AuthProviderProps): JSX.Element => {
  const {
    children,
    onSigninCallback,
    skipSigninCallback,
    onRemoveUser,
    userManager: userManagerProp = null,
    ...userManagerSettings
  } = props;

  const [userManager] = useState<UserManager>(() => {
    return (
        userManagerProp ??
        (UserManagerImpl
            ? new UserManagerImpl(userManagerSettings as UserManagerSettings)
            : ({ settings: userManagerSettings } as unknown as UserManager))
    );
  });

  const [state, dispatch] = useReducer(authReducer, initialAuthState);
  const didInitialize = useRef(false);

  // ----- build bound methods WITHOUT Object.fromEntries -----
  const userManagerContext = useMemo(() => {
    // ctx methods
    const ctxBits: CtxMethods = {
      clearStaleState:
          userManager.clearStaleState?.bind(userManager) ??
          (unsupportedEnvironment("clearStaleState") as unknown as CtxMethods["clearStaleState"]),
      querySessionStatus:
          userManager.querySessionStatus?.bind(userManager) ??
          (unsupportedEnvironment("querySessionStatus") as unknown as CtxMethods["querySessionStatus"]),
      revokeTokens:
          userManager.revokeTokens?.bind(userManager) ??
          (unsupportedEnvironment("revokeTokens") as unknown as CtxMethods["revokeTokens"]),
      startSilentRenew:
          userManager.startSilentRenew?.bind(userManager) ??
          (unsupportedEnvironment("startSilentRenew") as unknown as CtxMethods["startSilentRenew"]),
      stopSilentRenew:
          userManager.stopSilentRenew?.bind(userManager) ??
          (unsupportedEnvironment("stopSilentRenew") as unknown as CtxMethods["stopSilentRenew"]),
    };

    // navigator methods (dispatchებით)
    const navBits: NavMethods = {
      signinPopup: async (args) => {
        dispatch({ type: "NAVIGATOR_INIT", method: "signinPopup" });
        try {
          return await userManager.signinPopup(args);
        } catch (error) {
          dispatch({ type: "ERROR", error: error as Error });
          throw error;
        } finally {
          dispatch({ type: "NAVIGATOR_CLOSE" });
        }
      },
      signinSilent: async (args) => {
        dispatch({ type: "NAVIGATOR_INIT", method: "signinSilent" });
        try {
          return await userManager.signinSilent(args);
        } catch (error) {
          // შესაძლებელია null დავუბრუნოთ, როგორც ინტერფეისი ითხოვს
          dispatch({ type: "ERROR", error: error as Error });
          return null;
        } finally {
          dispatch({ type: "NAVIGATOR_CLOSE" });
        }
      },
      signinRedirect: async (args) => {
        dispatch({ type: "NAVIGATOR_INIT", method: "signinRedirect" });
        try {
          await userManager.signinRedirect(args);
        } catch (error) {
          dispatch({ type: "ERROR", error: error as Error });
          throw error;
        } finally {
          dispatch({ type: "NAVIGATOR_CLOSE" });
        }
      },
      signinResourceOwnerCredentials: async (args) => {
        dispatch({ type: "NAVIGATOR_INIT", method: "signinResourceOwnerCredentials" });
        try {
          return await userManager.signinResourceOwnerCredentials(args);
        } catch (error) {
          dispatch({ type: "ERROR", error: error as Error });
          throw error;
        } finally {
          dispatch({ type: "NAVIGATOR_CLOSE" });
        }
      },
      signoutPopup: async (args) => {
        dispatch({ type: "NAVIGATOR_INIT", method: "signoutPopup" });
        try {
          await userManager.signoutPopup(args);
        } catch (error) {
          dispatch({ type: "ERROR", error: error as Error });
          throw error;
        } finally {
          dispatch({ type: "NAVIGATOR_CLOSE" });
        }
      },
      signoutRedirect: async (args) => {
        dispatch({ type: "NAVIGATOR_INIT", method: "signoutRedirect" });
        try {
          await userManager.signoutRedirect(args);
        } catch (error) {
          dispatch({ type: "ERROR", error: error as Error });
          throw error;
        } finally {
          dispatch({ type: "NAVIGATOR_CLOSE" });
        }
      },
      signoutSilent: async (args) => {
        dispatch({ type: "NAVIGATOR_INIT", method: "signoutSilent" });
        try {
          await userManager.signoutSilent(args);
        } catch (error) {
          dispatch({ type: "ERROR", error: error as Error });
          throw error;
        } finally {
          dispatch({ type: "NAVIGATOR_CLOSE" });
        }
      },
    };

    return {
      settings: userManager.settings as unknown as UserManagerSettings, // cast for Context shape
      events: userManager.events as unknown as UserManagerEvents,
      ...ctxBits,
      ...navBits,
    };
  }, [userManager]);

  // ----- bootstrap / callback -----
  useEffect(() => {
    if (!userManager || didInitialize.current) return;
    didInitialize.current = true;

    void (async () => {
      let userMaybe: User | void | null = null;
      try {
        // დაბრუნება IdP-დან
        if (hasAuthParams() && !skipSigninCallback) {
          userMaybe = await userManager.signinRedirectCallback();
          if (onSigninCallback) await onSigninCallback(userMaybe);
        }

        const loaded = (userMaybe ?? (await userManager.getUser())) as User | null;
        let user: User | null = loaded;

        // სურვილისამებრ დამატებითი პროფილი ბექიდან
        if (user && window.location.pathname !== "/logout") {
          const uname = user.profile?.preferred_username;
          if (uname) {
            const response = await privateAxios.get(`/users/user-detail/${uname}`);
            if (!response.data?.isActive) {
              await userManager.signoutSilent();
              user = null;
            } else {
              sessionStorage.setItem(
                  "permissions",
                  JSON.stringify(response.data.permissions || [])
              );
              if (response.data.userConfig) {
                sessionStorage.setItem("userConfig", response.data.userConfig);
              }
            }
          }
        }

        // ✅ ნორმალიზებული ტიპი რედიუსერისთვის
        dispatch({ type: "INITIALISED", user });
      } catch (error) {
        dispatch({ type: "ERROR", error: signinError(error) });
      }
    })();
  }, [userManager, skipSigninCallback, onSigninCallback]);

  // ----- events -----
  useEffect(() => {
    if (!userManager) return;

    const handleUserLoaded = (user: User) => dispatch({ type: "USER_LOADED", user });
    const handleUserUnloaded = () => dispatch({ type: "USER_UNLOADED" });
    const handleUserSignedOut = () => dispatch({ type: "USER_SIGNED_OUT" });
    const handleSilentRenewError = (error: Error) => dispatch({ type: "ERROR", error });

    userManager.events.addUserLoaded(handleUserLoaded);
    userManager.events.addUserUnloaded(handleUserUnloaded);
    userManager.events.addUserSignedOut(handleUserSignedOut);
    userManager.events.addSilentRenewError(handleSilentRenewError);

    return () => {
      userManager.events.removeUserLoaded(handleUserLoaded);
      userManager.events.removeUserUnloaded(handleUserUnloaded);
      userManager.events.removeUserSignedOut(handleUserSignedOut);
      userManager.events.removeSilentRenewError(handleSilentRenewError);
    };
  }, [userManager]);

  // ----- removeUser typed -----
  const removeUser = useCallback((): Promise<void> => {
    if (!userManager) return Promise.reject(unsupportedEnvironment("removeUser")());
    return userManager
        .removeUser()
        .then(async () => {
          if (onRemoveUser) await onRemoveUser();
        })
        .then(() => {});
  }, [userManager, onRemoveUser]);

  return (
      <AuthContext.Provider
          value={{
            ...state,
            ...userManagerContext,
            removeUser,
          }}
      >
        {children}
      </AuthContext.Provider>
  );
};
