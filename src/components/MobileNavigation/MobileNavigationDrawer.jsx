import React, {useMemo, useState} from 'react';
import {Button, Drawer, Input, Menu, Space} from "antd";
import LanguageSelector from "../header/languageSelector/LanguageSelector.jsx";
import {FiSettings, FiUser} from "react-icons/fi";
import {useTranslation} from "react-i18next";
import {NavLink, useLocation, useNavigate} from "react-router-dom";

const MobileNavigationDrawer = () => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = useMemo(() => ([
        { key: "/",        label: <NavLink to="/">{t("nav.home")}</NavLink> },
        { key: "/about",   label: <NavLink to="/about">{t("nav.about")}</NavLink> },
        { key: "/maps",    label: <NavLink to="/maps">{t("nav.maps")}</NavLink> },
        { key: "/contact", label: <NavLink to="/contact">{t("nav.contact")}</NavLink> },
    ]), [t]);

    const selectedKeys = useMemo(() => {
        const root = `/${(location.pathname.split("/")[1] || "")}`;
        return root === "/" ? ["/"] : [root];
    }, [location.pathname]);

    const Brand = (
        <NavLink to="/" className="wx-brand">
            <span className="wx-brand-main">Weather</span>
            <span className="wx-brand-sub">app</span>
        </NavLink>
    );

    const onSearch = (value) => {
        const q = value?.trim();
        if (!q) return;
        navigate(`/search?q=${encodeURIComponent(q)}`);
        // setOpen(false);
    };

    return (
        <Drawer
            placement="left"
            width={280}
            open={open}
            onClose={() => setOpen(false)}
            bodyStyle={{ padding: 0 }}
            className="wx-drawer"
        >
            <div className="wx-drawer-head">
                {Brand}
            </div>
            <div className="wx-drawer-body">
                <Menu
                    mode="inline"
                    selectedKeys={selectedKeys}
                    items={menuItems}
                    onClick={() => setOpen(false)}
                />
                <div className="wx-drawer-search">
                    <Input.Search
                        placeholder={t("common.searchPlaceholder") || "Search…"}
                        allowClear
                        onSearch={onSearch}
                        enterButton
                    />
                </div>
                <div className="wx-drawer-footer">
                    <LanguageSelector />
                    <Space>
                        <Button icon={<FiSettings />} onClick={() => { setOpen(false); navigate("/account/settings"); }}>
                            {t("common.settings") || "Settings"}
                        </Button>
                        <Button type="primary" icon={<FiUser />} onClick={() => { setOpen(false); navigate("/account"); }}>
                            {t("common.signIn") || "Sign in"}
                        </Button>
                    </Space>
                </div>
            </div>
        </Drawer>
    );
};

export default MobileNavigationDrawer;