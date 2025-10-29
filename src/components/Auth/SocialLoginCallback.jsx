import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "../../features/auth/authSlice";
import { storeAuthCredentials } from "../../utils/auth";

function parseParams(search) {
    const qs = search.startsWith("?") ? search.slice(1) : search;
    const normalized = qs.replace(/\?(?=.*)/g, "&");
    const p = new URLSearchParams(normalized);
    return {
        token: p.get("token") || "",
        userName: p.get("userName") || p.get("username") || "",
        userEmail: p.get("userEmail") || p.get("email") || "",
        permissions: p.get("permissions") ? JSON.parse(decodeURIComponent(p.get("permissions"))) : undefined,
        userConfig: p.get("userConfig") ? JSON.parse(decodeURIComponent(p.get("userConfig"))) : undefined,
    };
}

export default function SocialLoginCallback() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const { token, userName, userEmail, permissions, userConfig } = parseParams(window.location.search);

        if (token) {
            // Update Redux store
            dispatch(setCredentials({ userName, accessToken: token }));

            // Store credentials using centralized utility
            storeAuthCredentials({ token, userName, userEmail, permissions, userConfig });

            // Redirect to home page
            navigate("/", { replace: true });
        } else {
            navigate("/login", { replace: true });
        }
    }, [dispatch, navigate]);

    return null;
}
