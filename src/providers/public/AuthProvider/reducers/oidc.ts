// src/providers/public/AuthProvider/reducers/oidc.ts
import { UserManager, WebStorageStateStore, type UserManagerSettings } from 'oidc-client-ts';

export const oidcSettings: UserManagerSettings = {
    authority: import.meta.env.VITE_OIDC_AUTHORITY as string,
    client_id: import.meta.env.VITE_OIDC_CLIENT_ID as string,
    redirect_uri: import.meta.env.VITE_OIDC_REDIRECT_URI as string,
    silent_redirect_uri: import.meta.env.VITE_OIDC_SILENT_REDIRECT_URI as string,
    response_type: 'code', // PKCE
    scope: (import.meta.env.VITE_OIDC_SCOPE as string) || 'openid profile email',

    automaticSilentRenew: true,
    loadUserInfo: true,

    // sessionStorage როგორც შენ სხვა პროექტში იყენებ
    userStore: new WebStorageStateStore({ store: window.sessionStorage }),

    // სურვილისამებრ:
    // post_logout_redirect_uri: import.meta.env.VITE_OIDC_POST_LOGOUT_REDIRECT_URI as string,
    // monitorSession: true,
};

export const userManager = new UserManager(oidcSettings);
