import React, { useRef, useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentToken,
  setCredentials,
} from "../../features/auth/authSlice";
import { useLoginMutation } from "../../features/auth/authApiSlice";

import { Button, Form, Input, Spin } from "antd";
import { AiFillLock, AiOutlineUser } from "react-icons/ai";
import ParticlesBG from "./ParticlesBG.jsx";
import Title from "antd/es/typography/Title";

import s from "./Login.module.css";

const Login = () => {
  const token = useSelector(selectCurrentToken);
  const userRef = useRef();
  const errRef = useRef();
  const [userName, setUserName] = useState();
  const [pwd, setPwd] = useState();
  const [errMsg, setErrMsg] = useState();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [userName, pwd]);

  const onFinish = async (values) => {
    try {
      const userData = await login({ ...values, channel: "ADMIN" }).unwrap();
      const authUser = userData.message.userName;
      const token = userData.message.token;
      dispatch(setCredentials({ userName: authUser, accessToken: token }));
      setUserName(values.userName);
      setPwd(values.password);
      navigate("/admin");
    } catch (err) {
      if (!err) {
        setErrMsg("No Server Response");
      } else {
        setErrMsg(err.data.message);
        errRef.current?.focus();
      }
    }
  };

  const content = isLoading ? (
    <div className={"spinLocation"}>
      <Spin size="large" spinning={true} className={"spinnn"} />
    </div>
  ) : (
    <div className={s.loginContainer}>
      <ParticlesBG />
      <Form
        name="normal_login"
        className={s.loginForm}
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Title color="#ddd" className={s.title} level={3}>
          Account Login
        </Title>
        <Form.Item
          name="userName"
          rules={[{ required: true, message: "Please input your Username!" }]}
        >
          <Input
            ref={userRef}
            prefix={<AiOutlineUser />}
            placeholder="Username"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input
            prefix={<AiFillLock />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>

        <div className="flex-fill flex-column">
          <Form.Item className={"flex"}>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Enter
            </Button>
          </Form.Item>
          <div className="flex">
            <p ref={errRef} className={s.errorMessage}>
              {errMsg}
            </p>
          </div>
        </div>
      </Form>
    </div>
  );

  return token ? <Navigate to="/admin" /> : content;
};

export default Login;
