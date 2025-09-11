import React from "react";
import { Layout, Menu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { FiCloud, FiCamera, FiMap, FiBarChart2, FiNavigation, FiPackage, FiBook, FiTruck, FiLayers, FiRss } from "react-icons/fi";

const items = [
    { key: "/7-day",      icon: <FiCloud />,      label: "7-Day Weather" },
    { key: "/10-day",     icon: <FiCloud />,      label: "10-Day Weather" },
    { key: "/today",      icon: <FiBarChart2 />,  label: "Weather Today" },
    { key: "/webcams",    icon: <FiCamera />,     label: "Webcams" },
    { key: "/maps",       icon: <FiMap />,        label: "Weather Maps" },
    { key: "/forecast",   icon: <FiNavigation />, label: "Forecast" },
    { key: "/outdoor",    icon: <FiTruck />,      label: "Outdoor & Sports" },
    { key: "/aviation",   icon: <FiNavigation />, label: "Aviation" },
    { key: "/agri",       icon: <FiLayers />,     label: "Agriculture" },
    { key: "/history",    icon: <FiBook />,       label: "History & Climate" },
    { key: "/products",   icon: <FiPackage />,    label: "Products" },
    { key: "/widgets",    icon: <FiLayers />,     label: "Widgets" },
    { key: "/news",       icon: <FiRss />,        label: "News" },
];

export default function SiderNav() {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const root = "/" + (pathname.split("/")[1] || "");
    return (
        <Layout.Sider
            className="wx-sider"
            width={220}
            breakpoint="lg"
            collapsedWidth={0}
            theme="dark"
        >
            <div className="wx-sider-brand">MeteoHub</div>
            <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[root]}
                items={items}
                onClick={(e) => navigate(e.key)}
            />
        </Layout.Sider>
    );
}
