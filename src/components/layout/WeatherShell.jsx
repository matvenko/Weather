import React from "react";
import { Layout } from "antd";
import WeatherTopbar from "./WeatherTopbar";
import SiderNav from "./SiderNav";
import "../../css/weather.css";

export default function WeatherShell({ children }) {
    return (
        <Layout className="wx-shell">
            <SiderNav />
            <Layout>
                <WeatherTopbar />
                <Layout.Content className="wx-content">
                    {children}
                </Layout.Content>
            </Layout>
        </Layout>
    );
}
