import React from "react";
import {Layout, Input, Space, Tooltip, Menu, Button} from "antd";
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import { FiUser, FiSettings } from "react-icons/fi";
import LanguageSelector from "../header/languageSelector/LanguageSelector.jsx";
import {useTranslation} from "react-i18next";
import "../../css/header.css";

export default function WeatherTopbar() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { key: "/about",   label: <NavLink to="/about">{t("nav.about")}</NavLink> },
        { key: "/maps",    label: <NavLink to="/maps">{t("nav.maps")}</NavLink> },
        { key: "/contact", label: <NavLink to="/contact">{t("nav.contact")}</NavLink> },
    ];

    const root = `/${(location.pathname.split("/")[1] || "")}`;
    const selected = root === "/" ? [] : [root];

    return (
        <Layout.Header className="wx-topbar">
            <div className="wx-topbar-inner">
                <div className="wx-topbar-title" onClick={() => navigate("/")}>
                    Weather
                </div>
                <Input.Search
                    className="wx-search"
                    placeholder="Location search..."
                    allowClear
                    onSearch={(v) => console.log("search:", v)}
                />


                <nav aria-label="Main navigation">
                    <Menu
                        className="header-menu"
                        mode="horizontal"
                        selectedKeys={selected}
                        items={menuItems}
                    />
                </nav>

                <Space size="large" className="wx-topbar-actions">
                    <Tooltip title="Change Language"><LanguageSelector /></Tooltip>
                    <Tooltip title="Account"><FiUser onClick={() => navigate("/login")} /></Tooltip>
                    <Tooltip title="Settings"><FiSettings /></Tooltip>
                </Space>
            </div>
        </Layout.Header>
    );
}
