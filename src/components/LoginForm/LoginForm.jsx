import React, {useEffect, useRef, useState} from "react";
import s from "./Login.module.css";
import {Button, Divider, Form, Input, Modal} from "antd";
import {AppleOutlined, FacebookOutlined, GoogleOutlined, LockOutlined, UserOutlined} from "@ant-design/icons";
import {useTranslation} from "react-i18next";
import {useGlobalProvider} from "@src/providers/public/GlobalProvider/index.js";
import {useLoginUser} from "@src/components/LoginForm/hooks/useLoginUser.js";
import {useResendEmailVerification} from "@src/components/LoginForm/hooks/useResendEmailVerification.ts";
import {useNavigate} from "react-router-dom";
import {handleAppleLogin, handleFacebookLogin, handleGoogleLogin} from "@src/utils/socialAuth.js";
import {useDispatch} from "react-redux";
import {setCredentials} from "@src/features/auth/authSlice.js";
import {storeAuthCredentials} from "@src/utils/auth.js";

export default function LoginForm() {
    const userRef = useRef(null);
    const {t} = useTranslation();
    const {notificationApi} = useGlobalProvider();
    const navigate = useNavigate();
    const dispatch = useDispatch();
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
                    // Store credentials in Redux and localStorage
                    const token = response?.token || response?.accessToken;
                    const userName = response?.userName || response?.username;
                    const userEmail = response?.userEmail || response?.email;

                    if (token) {
                        // Update Redux store
                        dispatch(setCredentials({ userName, accessToken: token }));

                        // Store in localStorage using utility
                        storeAuthCredentials({
                            token,
                            userName,
                            userEmail,
                            permissions: response?.permissions,
                            userConfig: response?.userConfig
                        });
                    }

                    // წარმატების შეტყობინება
                    notificationApi?.success({
                        message: "Welcome!",
                        description: response?.message || "You have successfully logged in.",
                        duration: 1,
                    });

                    setTimeout(() => {
                        navigate("/");
                    }, 2200);
                },

                onError: (error) => {
                    const errorMessage = error?.response?.data?.message;

                    // შევამოწმოთ არის თუ არა ეს ემაილის ვერიფიკაციის შეცდომა
                    if (errorMessage === 'მეილის ვერიფიკაცია არ არის დასრულებული!') {
                        setUserEmail(values.userEmail || values.email);
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

                <div className={s.socialButtons}>
                    <Button
                        shape="circle"
                        size="large"
                        icon={<GoogleOutlined/>}
                        className={s.googleBtn}
                        onClick={handleGoogleLogin}
                    />
                    <Button
                        shape="circle"
                        size="large"
                        icon={<FacebookOutlined/>}
                        className={s.facebookBtn}
                        onClick={handleFacebookLogin}
                    />
                    <Button
                        shape="circle"
                        size="large"
                        icon={<AppleOutlined/>}
                        className={s.appleBtn}
                        onClick={handleAppleLogin}
                    />
                </div>

            </Form>

            <Modal
                title={t("require_email_verification_title")}
                open={showResendModal}
                onCancel={() => setShowResendModal(false)}
                footer={[
                    <Button key="cancel" className={"capitalize"} onClick={() => setShowResendModal(false)}>
                        {t("cancel")}
                    </Button>,
                    <Button
                        key="resend"
                        type="primary"
                        loading={resendEmailMutation.isPending}
                        onClick={handleResendVerification}
                        className={"capitalize"}
                    >
                        {t("resend")}
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
