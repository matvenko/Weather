import React from "react";
import {Layout} from "antd";
import {useLocation} from "react-router-dom";
import "../../css/weather.css";
import VideoBannerContainer from "../VideoBanner/VideoBannerContainer.jsx";
import HeaderContainer from "../header/HeaderContainer.jsx";
import SiderNav from "@src/components/layout/SiderNav.jsx";

export default function WeatherShell({children}) {
    const location = useLocation();
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

    return (
        <Layout className="wx-shell">
            {!isAuthPage && <SiderNav/>}
            <Layout>
                <Layout.Content className="wx-content">
                    <HeaderContainer/>
                    <VideoBannerContainer/>
                    {children}
                </Layout.Content>
            </Layout>
        </Layout>
    );
}
