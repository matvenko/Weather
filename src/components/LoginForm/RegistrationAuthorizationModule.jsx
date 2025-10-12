import React from "react";
import {Navigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {Tabs, Typography} from "antd";

import {selectCurrentToken,} from "../../features/auth/authSlice";

import s from "./Login.module.css";
import RegisterForm from "./RegisterForm.jsx";
import LoginForm from "./LoginForm.jsx";
import {useTranslation} from "react-i18next";

const {Title, Text} = Typography;

export default function LoginRegister() {
    const token = useSelector(selectCurrentToken);
    const {t} = useTranslation();

    const card = (
        <div className={s.card}>
            <div className={s.left}>
                <div className={s.leftInner}>
                    <Title level={2} className={s.leftTitle}>Welcome Page</Title>
                    <Text className={s.leftText}>
                        Meteo360 — precise forecasts and beautiful maps at your fingertips.
                        Our platform delivers real-time weather insights, detailed maps,
                        and personalized alerts so you’re always prepared.
                        Explore climate trends, track storms, and enjoy a modern interface
                        designed for professionals and everyday users alike.
                    </Text>

                </div>
            </div>

            <div className={s.right}>
                <div className={s.tabsWrap}>
                    <Tabs
                        className={s.tabs}
                        items={[
                            {key: "signin", label: t("auth.sign_in"), children: <LoginForm />},
                            {key: "register", label: t("auth.register"), children: <RegisterForm/>},
                        ]}
                        defaultActiveKey="signin"
                        centered
                    />
                </div>
            </div>
        </div>
    );

    return token ? (
        <Navigate to="/admin"/>
    ) : (
        <div className={s.shell}>
            {card}
        </div>
    );
}
