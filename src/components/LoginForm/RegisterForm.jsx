import React, {useState} from 'react';
import s from "./Login.module.css";
import {Button, Checkbox, Divider, Form, Input} from "antd";
import {LockOutlined, MailOutlined, UserOutlined} from "@ant-design/icons";
import GoogleLoginButton from "./GoogleButton.jsx";

const RegisterForm = () => {
    const [errMsg, setErrMsg] = useState("");
    const onFinishRegister = async (values) => {
        setErrMsg("");
        try {
            // TODO: ჩაანაცვლე შენი რეგისტრაციის API-თ
            // const res = await register(values).unwrap();
            // შემდეგ ავტო-login ან გადასვლა /login-ზე
            console.log("Register payload →", values);
        } catch (err) {
            setErrMsg(err?.data?.message || "Registration failed");
        }
    };
    return (
        <Form layout="vertical" size="large" onFinish={onFinishRegister} className={s.form}>
            <Form.Item label="Full name" name="fullName" rules={[{ required: true, message: "Please input your full name" }]}>
                <Input prefix={<UserOutlined />} placeholder="Jane Doe" />
            </Form.Item>
            <Form.Item label="Email" name="email" rules={[{ required: true, type: "email", message: "Please input a valid email" }]}>
                <Input prefix={<MailOutlined />} placeholder="name@domain.com" />
            </Form.Item>
            <Form.Item label="Password" name="password" rules={[{ required: true, message: "Please input your password" }]}>
                <Input.Password prefix={<LockOutlined />} placeholder="Create a password" />
            </Form.Item>
            <Form.Item name="tos" valuePropName="checked" rules={[{ validator: (_, v) => (v ? Promise.resolve() : Promise.reject("Please accept terms")) }]}>
                <Checkbox>
                    I agree all the statements in <a href="/terms" target="_blank" rel="noreferrer">Terms of Service</a>
                </Checkbox>
            </Form.Item>

            <Button type="primary" htmlType="submit" block className={s.primaryBtn /* loading={regLoading} */}>
                Sign Up
            </Button>

            <Divider className={s.divider}>or continue with</Divider>


            <GoogleLoginButton />

            {errMsg && <p className={s.error}>{errMsg}</p>}
        </Form>
    );
};

export default RegisterForm;