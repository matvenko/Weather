import React, { useEffect, useRef, useState } from "react";
import s from "./Login.module.css";
import { Button, Divider, Form, Input } from "antd";
import { GoogleOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import {useTranslation} from "react-i18next";
import {useGlobalProvider} from "@src/providers/public/GlobalProvider/index.js";
import {useLoginUser} from "@src/components/LoginForm/hooks/useLoginUser.js";

export default function LoginForm() {
    const userRef = useRef(null);
    const { t } = useTranslation();
    const { notificationApi } = useGlobalProvider();

    const loginUserMutation = useLoginUser()

    useEffect(() => userRef.current?.focus(), []);

    const onFinishLogin = async (values) => {
        loginUserMutation.mutate({...values}, {
            onSuccess: (response) => {
                notificationApi?.success({
                    message: response?.message
                });
            },
            onError: (error) => {
                notificationApi?.error({
                    message: error?.response?.data?.message
                });
            }
        })
    };

    const handleGoogleLogin = () => {
        window.open(
            "https://weather-api.webmania.ge/api/v1/auth/google/redirect",
            "google_oauth",
            "width=500,height=600,scrollbars=yes"
        );
    };

    return (
        <Form layout="vertical" size="large" onFinish={onFinishLogin} className={s.form}>
            <Form.Item
                label="Email or Username"
                name="email"
                rules={[{ required: true, message: "Please input your username or email" }]}
            >
                <Input ref={userRef} prefix={<UserOutlined />} placeholder="username@email.com" />
            </Form.Item>
            <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Please input your password" }]}
            >
                <Input.Password prefix={<LockOutlined />} placeholder="••••••••" />
            </Form.Item>

            <Button type="primary" htmlType="submit" block className={s.primaryBtn}>
                Sign In
            </Button>

            <Divider className={s.divider}>or continue with</Divider>
            <Button block icon={<GoogleOutlined />} className={s.googleBtn} onClick={handleGoogleLogin}>
                Sign in with Google
            </Button>

        </Form>
    );
}
