import React, {useEffect, useRef, useState} from "react";
import s from "./Login.module.css";
import {Button, Divider, Form, Input, Modal} from "antd";
import {GoogleOutlined, LockOutlined, UserOutlined} from "@ant-design/icons";
import {useTranslation} from "react-i18next";
import {useGlobalProvider} from "@src/providers/public/GlobalProvider/index.js";
import {useLoginUser} from "@src/components/LoginForm/hooks/useLoginUser.js";
import {useResendEmailVerification} from "@src/components/LoginForm/hooks/useResendEmailVerification.ts";
import {useNavigate} from "react-router-dom";

export default function LoginForm() {
    const userRef = useRef(null);
    const {t} = useTranslation();
    const {notificationApi} = useGlobalProvider();
    const navigate = useNavigate();
    const [showResendModal, setShowResendModal] = useState(false);
    const [userEmail, setUserEmail] = useState("");

    const loginUserMutation = useLoginUser();
    const resendEmailMutation = useResendEmailVerification();

    useEffect(() => userRef.current?.focus(), []);

    const onFinishLogin = async (values) => {
        loginUserMutation.mutate(
            {...values},
            {
                onSuccess: (response) => {
                    // წარმატების შეტყობინება
                    notificationApi?.success({
                        message: "Welcome!",
                        description: response?.message || "You have successfully logged in.",
                        duration: 2, // 2 წამით გამოჩნდება
                    });

                    setTimeout(() => {
                        navigate("/");
                    }, 2200);
                },

                onError: (error) => {
                    const errorMessage = error?.response?.data?.message;

                    // შევამოწმოთ არის თუ არა ეს ემაილის ვერიფიკაციის შეცდომა
                    if (errorMessage === 'მეილის ვერიფიკაცია არ არის დასრულებული!') {
                        setUserEmail(values.email);
                        setShowResendModal(true);
                    } else {
                        notificationApi?.error({
                            message: "Login failed",
                            description: errorMessage || "Please try again.",
                            duration: 3,
                        });
                    }
                },
            }
        );
    };


    const handleGoogleLogin = () => {
        window.open(
            "https://weather-api.webmania.ge/api/v1/auth/google/redirect",
            "google_oauth",
            "width=500,height=600,scrollbars=yes"
        );
    };

    const handleResendVerification = () => {
        resendEmailMutation.mutate(
            {email: userEmail},
            {
                onSuccess: (response) => {
                    setShowResendModal(false);
                    notificationApi?.success({
                        message: "Email Sent!",
                        description: "Verification email has been resent. Please check your inbox.",
                        duration: 3,
                    });
                },
                onError: (error) => {
                    notificationApi?.error({
                        message: "Failed to send email",
                        description: error?.response?.data?.message || "Please try again later.",
                        duration: 3,
                    });
                },
            }
        );
    };

    return (
        <>
            <Form layout="vertical" size="large" onFinish={onFinishLogin} className={s.form}>
                <Form.Item
                    label={t("auth.email_or_username")}
                    name="email"
                    rules={[{required: true, message: "Please input your username or email"}]}
                >
                    <Input ref={userRef} prefix={<UserOutlined/>} placeholder="username@email.com"/>
                </Form.Item>
                <Form.Item
                    label={t("auth.password")}
                    name="password"
                    rules={[{required: true, message: "Please input your password"}]}
                >
                    <Input.Password prefix={<LockOutlined/>} placeholder="••••••••"/>
                </Form.Item>

                <Button type="primary" htmlType="submit" block className={s.primaryBtn}>
                    {t("auth.login")}
                </Button>

                <Divider className={s.divider}>or continue with</Divider>
                <Button block icon={<GoogleOutlined/>} className={s.googleBtn} onClick={handleGoogleLogin}>
                    {t("auth.google_sign_in")}
                </Button>

            </Form>

            <Modal
                title={t("require_email_verification_title")}
                open={showResendModal}
                onCancel={() => setShowResendModal(false)}
                footer={[
                    <Button key="cancel" onClick={() => setShowResendModal(false)}>
                        Cancel
                    </Button>,
                    <Button
                        key="resend"
                        type="primary"
                        loading={resendEmailMutation.isPending}
                        onClick={handleResendVerification}
                    >
                        Resend Verification Email
                    </Button>,
                ]}
            >
                <p>
                    {t("require_email_verification_text")} <strong>{userEmail}</strong>?
                </p>
            </Modal>
        </>
    );
}
