import React, { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form, Input, Checkbox, Divider, Tabs, Typography } from "antd";
import { GoogleOutlined, MailOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import { AiOutlineFacebook, AiOutlineTwitter } from "react-icons/ai";

import { selectCurrentToken, setCredentials } from "../../features/auth/authSlice";
import { useLoginMutation } from "../../features/auth/authApiSlice";
// OPTIONAL: useRegisterMutation თუ გაქვს
// import { useRegisterMutation } from "../../features/auth/authApiSlice";

import s from "./Login.module.css";
import GoogleLoginButton from "./GoogleButton.jsx";

const { Title, Text } = Typography;
const API_BASE = import.meta?.env?.VITE_API_URL || "";

export default function LoginRegister() {
  const token = useSelector(selectCurrentToken);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userRef = useRef(null);
  const [errMsg, setErrMsg] = useState("");

  const [login, { isLoading: logLoading }] = useLoginMutation();
  // const [register, { isLoading: regLoading }] = useRegisterMutation?.() ?? [{}];

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
      const userData = await login({ ...values, channel: "ADMIN" }).unwrap();
      const authUser = userData.message.userName;
      const token = userData.message.token;
      dispatch(setCredentials({ userName: authUser, accessToken: token }));
      navigate("/admin");
    } catch (err) {
      setErrMsg(err?.data?.message || "Login failed");
    }
  };

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


  const SignInForm = (
      <Form layout="vertical" size="large" onFinish={onFinishLogin} className={s.form}>
        <Form.Item label="Email or Username" name="userName" rules={[{ required: true, message: "Please input your username or email" }]}>
          <Input ref={userRef} prefix={<UserOutlined />} placeholder="username@email.com" />
        </Form.Item>
        <Form.Item label="Password" name="password" rules={[{ required: true, message: "Please input your password" }]}>
          <Input.Password prefix={<LockOutlined />} placeholder="••••••••" />
        </Form.Item>

        <Button type="primary" htmlType="submit" block className={s.primaryBtn} loading={logLoading}>
          Sign In
        </Button>

        <Divider className={s.divider}>or continue with</Divider>

        <Button block icon={<GoogleOutlined />} className={s.googleBtn} onClick={handleGoogleLogin}>
          Sign in with Google
        </Button>

        {errMsg && <p className={s.error}>{errMsg}</p>}
      </Form>
  );

  const RegisterForm = (
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

  const card = (
      <div className={s.card}>
        <div className={s.left}>
          <div className={s.leftInner}>
            <Title level={2} className={s.leftTitle}>Welcome Page</Title>
            <Text className={s.leftText}>
              MeteoHub — precise forecasts and beautiful maps at your fingertips.
              Our platform delivers real-time weather insights, detailed maps,
              and personalized alerts so you’re always prepared.
              Explore climate trends, track storms, and enjoy a modern interface
              designed for professionals and everyday users alike.
            </Text>

            <div className={s.socialBlock}>
              <span className={s.socialLabel}>Get connected with</span>
              <div className={s.socialRow}>
                <Button shape="circle" size="large" icon={<AiOutlineTwitter />} />
                <Button shape="circle" size="large" icon={<GoogleOutlined />} onClick={handleGoogleLogin} />
                <Button shape="circle" size="large" icon={<AiOutlineFacebook />} />
              </div>
            </div>
          </div>
        </div>

        <div className={s.right}>
          <div className={s.tabsWrap}>
            <Tabs
                className={s.tabs}
                items={[
                  { key: "signin", label: "Sign in", children: SignInForm },
                  { key: "register", label: "Register", children: RegisterForm },
                ]}
                defaultActiveKey="signin"
                centered
            />
          </div>
        </div>
      </div>
  );

  return token ? (
      <Navigate to="/admin" />
  ) : (
      <div className={s.shell}>
        {card}
      </div>
  );
}
