import React, {useEffect, useMemo, useState} from "react";
import {Layout, Menu, Button, Grid, Tooltip} from "antd";
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import {FiUser} from "react-icons/fi";
import {useTranslation} from "react-i18next";
import "./header.css";
import MobileNavigationDrawer from "../MobileNavigation/MobileNavigationDrawer.jsx";
import LanguageSelector from "./languageSelector/LanguageSelector.jsx";
import {selectCurrentToken} from "@src/features/auth/authSlice.js";
import {useSelector} from "react-redux";
import meteoLogo from "@src/images/meteo-logo-white.png";

const {Header} = Layout;
const {useBreakpoint} = Grid;

export default function HeaderContainer() {
    const {t} = useTranslation();
    const screens = useBreakpoint();
    const navigate = useNavigate();
    const location = useLocation();

    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);

    const [themeDark, setThemeDark] = useState(false);
    const token = useSelector(selectCurrentToken);


    console.log("token", token)
    // Sticky / shadow on scroll
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        onScroll();
        window.addEventListener("scroll", onScroll, {passive: true});
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Apply theme to <html data-theme="">
    useEffect(() => {
        const el = document.documentElement;
        el.dataset.theme = themeDark ? "dark" : "light";
        // სურვილისამებრ შეგიძლიათ localStorage-ში შეინახოთ:
        try {
            localStorage.setItem("theme", themeDark ? "dark" : "light");
        } catch {
        }
    }, [themeDark]);

    // Read persisted theme once (optional)
    useEffect(() => {
        try {
            const saved = localStorage.getItem("theme");
            if (saved === "dark") setThemeDark(true);
        } catch {
        }
    }, []);

    const menuItems = useMemo(() => ([
        {key: "/", label: <NavLink to="/">{t("nav.home")}</NavLink>},
        {key: "/about", label: <NavLink to="/about">{t("nav.about")}</NavLink>},
        {key: "/maps", label: <NavLink to="/maps">{t("nav.maps")}</NavLink>},
        {key: "/contact", label: <NavLink to="/contact">{t("nav.contact")}</NavLink>},
    ]), [t]);

    // Highlight by first segment
    const selectedKeys = useMemo(() => {
        const root = `/${(location.pathname.split("/")[1] || "")}`;
        return root === "/" ? ["/"] : [root];
    }, [location.pathname]);


    const Brand = (
        <NavLink to="/" className="wx-brand">
            <img src={meteoLogo} alt={"meteo360"} className={'logo'} />
        </NavLink>
    );

    const showButton = token ? (
        <Tooltip title={t("my_account") || "Account"}>
            <Button
                type="primary"
                icon={<FiUser />}
                onClick={() => navigate("/account")}
                className="wx-cta-btn"
            >
                {screens.md ? t("common.signIn") || "Sign in" : null}
            </Button>
        </Tooltip>
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
        // <Header className={`header container ${scrolled ? "nav-fixed" : "main-header"}`}>
        <Header className={`header container main-header`}>
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

                    <LanguageSelector/>


                    {showButton}


                    {!screens.lg && (
                        <Button
                            className={`wx-burger ${open ? 'is-open' : ''}`}
                            onClick={() => setOpen(prev => !prev)}
                        >
                            <span className="wx-burger-bar"/>
                            <span className="wx-burger-bar"/>
                            <span className="wx-burger-bar"/>
                        </Button>
                    )}
                </div>
            </div>


            <MobileNavigationDrawer/>

        </Header>
    );
}
