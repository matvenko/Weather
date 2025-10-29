import React, { useState } from "react";
import s from "./Login.module.css";
import { Button, Checkbox, Form, Input } from "antd";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import {useGlobalProvider} from "@src/providers/public/GlobalProvider/index.js";
import {useTranslation} from "react-i18next";
import {useRegistrationUser} from "@src/components/LoginForm/hooks/useRegistrationUser.js";
import {useCheckEmailAvailability} from "@src/components/LoginForm/hooks/useCheckEmailAvailability.ts";
import PasswordStrengthIndicator from "./PasswordStrengthIndicator.jsx";
import SocialLoginButtons from "./SocialLoginButtons.jsx";

export default function RegisterForm() {

    const { t } = useTranslation();
    const { notificationApi } = useGlobalProvider();
    const registerUserMutation = useRegistrationUser();
    const checkEmailMutation = useCheckEmailAvailability();
    const [emailStatus, setEmailStatus] = useState("");
    const [password, setPassword] = useState("");

    const handleEmailBlur = (e) => {
        const email = e.target.value;
        if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            checkEmailMutation.mutate(email, {
                onSuccess: (data) => {
                    if (!data.available) {
                        setEmailStatus("error");
                        notificationApi?.error({
                            message: "Email already taken",
                            description: data.message || "This email is already registered. Please use a different email or login.",
                            duration: 4,
                        });
                    } else {
                        setEmailStatus("success");
                    }
                },
                onError: () => {
                    setEmailStatus("");
                }
            });
        }
    };

    const onFinishRegister = async (values) => {
        registerUserMutation.mutate({...values}, {
            onSuccess: (response) => {
                notificationApi?.success({
                    message: response?.message || "Registration successful! Please check your email to verify your account."
                });
            },
            onError: (error) => {
                notificationApi?.error({
                    message: error?.response?.data?.message || "Registration failed. Please try again."
                });
            }
        })
    };

    return (
        <Form layout="vertical" size="large" onFinish={onFinishRegister} className={s.form}>
            <Form.Item
                label={t("auth.full_name") || "Full Name"}
                name="userName"
                rules={[{ required: true, message: "Please input your full name" }]}
            >
                <Input prefix={<UserOutlined />} placeholder="John Doe" />
            </Form.Item>
            <Form.Item
                label="Email"
                name="userEmail"
                rules={[
                    { required: true, type: "email", message: "Please input a valid email" },
                    { validator: async () => emailStatus === "error" ? Promise.reject("Email already taken") : Promise.resolve() }
                ]}
                validateStatus={emailStatus}
                hasFeedback
            >
                <Input
                    prefix={<MailOutlined />}
                    placeholder="name@domain.com"
                    onBlur={handleEmailBlur}
                />
            </Form.Item>
            <Form.Item
                label="Password"
                name="password"
            >
                <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Create a password"
                    onChange={(e) => setPassword(e.target.value)}
                />
            </Form.Item>
            {password && <PasswordStrengthIndicator password={password} />}
            <Form.Item
                label="Confirm password"
                name="password_confirmation"
                dependencies={["password"]}
                rules={[
                    { required: true, message: "Please confirm your password" },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue("password") === value) return Promise.resolve();
                            return Promise.reject("Passwords do not match");
                        },
                    }),
                ]}
            >
                <Input.Password prefix={<LockOutlined />} placeholder="Repeat password" />
            </Form.Item>

            <Form.Item
                name="tos"
                valuePropName="checked"
                rules={[{ validator: (_, v) => (v ? Promise.resolve() : Promise.reject("Please accept terms")) }]}
            >
                <Checkbox>
                    I agree all the statements in <a href="/terms" target="_blank" rel="noreferrer">Terms of Service</a>
                </Checkbox>
            </Form.Item>

            <Button type="primary" htmlType="submit" block className={s.primaryBtn}>
                Sign Up
            </Button>

            <SocialLoginButtons />
        </Form>
    );
}
