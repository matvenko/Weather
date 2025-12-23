import React, {useMemo} from 'react';
import {Button, Drawer, Menu, Space} from "antd";
import LanguageSelector from "../header/languageSelector/LanguageSelector.jsx";
import {FiUser} from "react-icons/fi";
import {AiOutlineLogout} from "react-icons/ai";
import {useTranslation} from "react-i18next";
import {NavLink, useLocation, useNavigate} from "react-router-dom";

const MobileNavigationDrawer = ({ open, onClose, isUserAuthorized, onLogout }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = useMemo(() => ([
        { key: "/",           label: <NavLink to="/">{t("nav.home")}</NavLink> },
        { key: "/about",      label: <NavLink to="/about">{t("nav.about")}</NavLink> },
        { key: "/maps",       label: <NavLink to="/maps">{t("nav.maps")}</NavLink> },
        { key: "/sferic-map", label: <NavLink to="/sferic-map">Sferic Map</NavLink> },
    ]), [t]);

    const selectedKeys = useMemo(() => {
        const root = `/${(location.pathname.split("/")[1] || "")}`;
        return root === "/" ? ["/"] : [root];
    }, [location.pathname]);

    const Brand = (
        <NavLink to="/" className="wx-brand">
            <span className="wx-brand-main">Meteo</span>
            <span className="wx-brand-sub">360</span>
        </NavLink>
    );

    const handleLogout = () => {
        onClose();
        onLogout();
    };

    return (
        <Drawer
            placement="left"
            width={280}
            open={open}
            onClose={onClose}
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
                    onClick={onClose}
                />
                <div className="wx-drawer-footer">
                    <div className="wx-drawer-footer-row">
                        <LanguageSelector />
                        <Space>
                            {isUserAuthorized ? (
                                <>
                                    <Button
                                        type="primary"
                                        icon={<FiUser />}
                                        onClick={() => { onClose(); navigate("/account"); }}
                                    >
                                        {t("my_account")}
                                    </Button>
                                    <Button
                                        icon={<AiOutlineLogout />}
                                        onClick={handleLogout}
                                    >
                                        {t("logout")}
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    type="primary"
                                    icon={<FiUser />}
                                    onClick={() => { onClose(); navigate("/login"); }}
                                >
                                    {t("auth.login")}
                                </Button>
                            )}
                        </Space>
                    </div>
                </div>
            </div>
        </Drawer>
    );
};

export default MobileNavigationDrawer;