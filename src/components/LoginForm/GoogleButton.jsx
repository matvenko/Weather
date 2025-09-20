// src/components/auth/GoogleLoginButton.jsx
import { Button } from "antd";
import { GoogleOutlined } from "@ant-design/icons";

const BACKEND_REDIRECT = "https://weather-api.webmania.ge/api/v1/auth/google/redirect";

export default function GoogleLoginButton() {
    const handleClick = () => {
        // გადავდივართ backend redirect endpoint-ზე იმავე tab-ში
        const origin = window.location.origin; // გამოიყენება რომ ბექმა იცოდეს საიდან მოვიდა
        window.location.href = `${BACKEND_REDIRECT}?origin=${encodeURIComponent(origin)}`;
    };

    return (
        <Button
            block
            icon={<GoogleOutlined />}
            onClick={handleClick}
            className="googleBtn"
        >
            Sign in with Google
        </Button>
    );
}
