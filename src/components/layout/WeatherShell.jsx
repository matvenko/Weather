import React from "react";
import { Layout } from "antd";
import SiderNav from "./SiderNav";
import "../../css/weather.css";
import VideoBannerContainer from "../VideoBanner/VideoBannerContainer.jsx";
import HeaderContainer from "./HeaderContainer.jsx";

export default function WeatherShell({ children }) {
    return (
        <Layout className="wx-shell">
            {/*<SiderNav />*/}
            <Layout>
                <HeaderContainer />
                <Layout.Content className="wx-content">

                    <VideoBannerContainer />

                    {children}
                </Layout.Content>
            </Layout>
        </Layout>
    );
}
