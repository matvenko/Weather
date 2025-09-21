import React from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";

export default function RequireOidc({ children }) {
    const { isAuthenticated, isLoading, signinRedirect } = useAuth();
    const location = useLocation();

    React.useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            if (location.pathname !== "/auth/callback") {
                // შევინახოთ საითი, სადაც უნდა დავბრუნდეთ
                signinRedirect({ state: { returnTo: location.pathname + location.search } });
            }
        }
    }, [isLoading, isAuthenticated, location.pathname, location.search, signinRedirect]);

    if (isLoading) return null;   // შეგიძლია ჩაანაცვლო სპინერით
    if (!isAuthenticated) return null;

    return children;
}
