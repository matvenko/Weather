import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "../../features/auth/authSlice";

function parseParams(search) {
    const qs = search.startsWith("?") ? search.slice(1) : search;
    const normalized = qs.replace(/\?(?=.*)/g, "&");
    const p = new URLSearchParams(normalized);
    return {
        token: p.get("token") || "",
        userName: p.get("userName") || p.get("username") || "",
    };
}

export default function SocialLoginCallback() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const { token, userName } = parseParams(window.location.search);

        if (token) {
            dispatch(setCredentials({ userName, accessToken: token }));
            // სურვილისამებრ localStorage-შიც
            localStorage.setItem("accessToken", token);
            localStorage.setItem("userName", userName || "");
            navigate("/admin", { replace: true });
        } else {
            navigate("/login", { replace: true });
        }
    }, [dispatch, navigate]);

    return null;
}
