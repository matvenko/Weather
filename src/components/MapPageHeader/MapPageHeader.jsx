import React, { useEffect, useMemo, useState, useRef } from "react";
import { Layout, Menu, Button, Grid, Tooltip } from "antd";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import MobileNavigationDrawer from "../MobileNavigation/MobileNavigationDrawer.jsx";
import LanguageSelector from "../header/languageSelector/LanguageSelector.jsx";
import { isAuthorized } from "@src/utils/auth.js";
import meteoLogo from "@src/images/meteo-logo-white.png";
import { logOut } from "@src/features/auth/authSlice.js";
import { useDispatch } from "react-redux";
import { AiOutlineLogout } from "react-icons/ai";
import "./mapPageHeader.css";

const { Header } = Layout;
const { useBreakpoint } = Grid;

export default function MapPageHeader({ forceHide = false, disableAutoShow = false }) {
    const { t } = useTranslation();
    const screens = useBreakpoint();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const [open, setOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const isUserAuthorized = isAuthorized();
    const hideTimerRef = useRef(null);

    // Mouse move detection to show/hide header
    useEffect(() => {
        // If auto-show is disabled, don't add mouse listeners
        if (disableAutoShow) {
            setIsVisible(true); // Always visible when manually controlled
            return;
        }

        const handleMouseMove = (e) => {
            // If forceHide is true, don't show header
            if (forceHide) {
                setIsVisible(false);
                // Clear any pending hide timer
                if (hideTimerRef.current) {
                    clearTimeout(hideTimerRef.current);
                    hideTimerRef.current = null;
                }
                return;
            }

            // Show header when mouse is in top 80px
            if (e.clientY <= 80) {
                // Clear any existing hide timer
                if (hideTimerRef.current) {
                    clearTimeout(hideTimerRef.current);
                    hideTimerRef.current = null;
                }
                setIsVisible(true);
            } else if (e.clientY > 150) {
                // Clear any existing hide timer before setting a new one
                if (hideTimerRef.current) {
                    clearTimeout(hideTimerRef.current);
                }
                // Hide header when mouse leaves top area (with delay)
                hideTimerRef.current = setTimeout(() => {
                    setIsVisible(false);
                    hideTimerRef.current = null;
                }, 500);
            }
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            if (hideTimerRef.current) {
                clearTimeout(hideTimerRef.current);
                hideTimerRef.current = null;
            }
        };
    }, [forceHide, disableAutoShow]);

    const handleLogout = async (e) => {
        dispatch(logOut());
        navigate("/login");
    };

    const menuItems = useMemo(() => ([
        { key: "/", label: <NavLink to="/">{t("nav.home")}</NavLink> },
        { key: "/about", label: <NavLink to="/about">{t("nav.about")}</NavLink> },
        { key: "/maps", label: <NavLink to="/maps">{t("nav.maps")}</NavLink> },
        { key: "/sferic-map", label: <NavLink to="/sferic-map">Sferic Map</NavLink> },
    ]), [t]);

    const selectedKeys = useMemo(() => {
        const root = `/${(location.pathname.split("/")[1] || "")}`;
        return root === "/" ? ["/"] : [root];
    }, [location.pathname]);

    const Brand = (
        <NavLink to="/" className="wx-brand">
            <img src={meteoLogo} alt={"meteo360"} className={'logo'} />
        </NavLink>
    );

    const showButton = isUserAuthorized ? (
        <>
            <Tooltip title={t("my_account") || "Account"}>
                <Button
                    type="primary"
                    icon={<FiUser />}
                    onClick={() => navigate("/account")}
                    className="wx-cta-btn"
                >
                    {screens.md ? t("my_account") : null}
                </Button>
            </Tooltip>
            <Tooltip>
                <Button
                    icon={<AiOutlineLogout />}
                    className={'capitalize'}
                    onClick={() => {
                        handleLogout().then();
                    }}
                >
                    {t('logout')}
                </Button>
            </Tooltip>
        </>
    ) : (
        <Tooltip title={t("auth.login")}>
            <Button
                type="primary"
                icon={<FiUser />}
                onClick={() => navigate("/login")}
                className="wx-cta-btn"
            />
        </Tooltip>
    );

    return (
        <Header className={`map-page-header ${isVisible ? 'visible' : 'hidden'}`}>
            <div className="wx-bar">
                {/* Left: Brand */}
                <div className="wx-left">
                    {Brand}
                </div>

                {/* Center: Desktop menu */}
                {screens.lg && (
                    <Menu
                        className="wx-menu"
                        mode="horizontal"
                        selectedKeys={selectedKeys}
                        items={menuItems}
                    />
                )}

                <div className="wx-right">
                    {screens.lg && <LanguageSelector />}
                    {screens.lg && showButton}

                    {!screens.lg && (
                        <Button
                            className={`wx-burger ${open ? 'is-open' : ''}`}
                            onClick={() => setOpen(prev => !prev)}
                        >
                            <span className="wx-burger-bar" />
                            <span className="wx-burger-bar" />
                            <span className="wx-burger-bar" />
                        </Button>
                    )}
                </div>
            </div>

            <MobileNavigationDrawer
                open={open}
                onClose={() => setOpen(false)}
                isUserAuthorized={isUserAuthorized}
                onLogout={handleLogout}
            />
        </Header>
    );
}
