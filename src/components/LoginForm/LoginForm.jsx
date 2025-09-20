import React, {useEffect, useRef, useState} from 'react';
import s from "./Login.module.css";
import {Button, Divider, Form, Input} from "antd";
import {GoogleOutlined, LockOutlined, UserOutlined} from "@ant-design/icons";
import {setCredentials} from "../../features/auth/authSlice.js";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useLoginMutation} from "../../features/auth/authApiSlice.js";

const LoginForm = () => {
    const [errMsg, setErrMsg] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [login, {isLoading: logLoading}] = useLoginMutation();
    const userRef = useRef(null);


    const handleGoogleLogin = () => {
        window.open(
            "https://weather-api.webmania.ge/api/v1/auth/google/redirect",

            "width=500,height=600,scrollbars=yes"
        )
    };

    useEffect(() => userRef.current?.focus(), []);

    const onFinishLogin = async (values) => {
        setErrMsg("");
        try {
            const userData = await login({...values, channel: "ADMIN"}).unwrap();
            const authUser = userData.message.userName;
            const token = userData.message.token;
            dispatch(setCredentials({userName: authUser, accessToken: token}));
            navigate("/admin");
        } catch (err) {
            setErrMsg(err?.data?.message || "Login failed");
        }
    };
    return (
        <Form layout="vertical" size="large" onFinish={onFinishLogin} className={s.form}>
            <Form.Item label="Email or Username" name="userName"
                       rules={[{required: true, message: "Please input your username or email"}]}>
                <Input ref={userRef} prefix={<UserOutlined/>} placeholder="username@email.com"/>
            </Form.Item>
            <Form.Item label="Password" name="password"
                       rules={[{required: true, message: "Please input your password"}]}>
                <Input.Password prefix={<LockOutlined/>} placeholder="••••••••"/>
            </Form.Item>

            <Button type="primary" htmlType="submit" block className={s.primaryBtn} loading={logLoading}>
                Sign In
            </Button>

            <Divider className={s.divider}>or continue with</Divider>

            <Button block icon={<GoogleOutlined/>} className={s.googleBtn} onClick={handleGoogleLogin}>
                Sign in with Google
            </Button>

            {errMsg && <p className={s.error}>{errMsg}</p>}
        </Form>
    );
};

export default LoginForm;