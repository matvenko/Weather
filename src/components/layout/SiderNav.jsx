import React, { useState } from "react";
import { Layout, Menu } from "antd";
import { useNavigate } from "react-router-dom";
import {
    FiMap, FiNavigation, FiTruck, FiLayers,
    FiChevronLeft, FiChevronRight,
    FiCompass, FiWind, FiAnchor, FiMoon,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentDeviceViewPort, selectDailyRange } from "@src/features/app/appSlice.js";
import { MdOutlineLocalGroceryStore } from "react-icons/md";

// route map: key → path
const routeMap = {
    forecast:    "/",
    maps:        "/maps",
    products:    "/products",
    where2go:    "/outdoor/where2go",
    snow:        "/outdoor/snow",
    sea_surf:    "/outdoor/sea-surf",
    astronomy:   "/outdoor/astronomy",
    agriculture: null,
};

const menuItems = [
    { type: "divider" },
    { key: "forecast",    icon: <FiNavigation />, label: "Forecast" },
    { key: "maps",        icon: <FiMap />,         label: "Weather Maps" },
    { key: "products",    icon: <MdOutlineLocalGroceryStore />, label: "Products" },
    {
        key: "outdoor",
        icon: <FiTruck />,
        label: "Outdoor & Sports",
        children: [
            { key: "where2go",  icon: <FiCompass />, label: "Where to Go" },
            { key: "snow",      icon: <FiWind />,    label: "Snow" },
            { key: "sea_surf",  icon: <FiAnchor />,  label: "Sea & Surf" },
            { key: "astronomy", icon: <FiMoon />,    label: "Astronomy Seeing" },
        ],
    },
    { key: "agriculture", icon: <FiLayers />, label: "Agriculture" },
];

export default function SiderNav() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const dailyRange = useSelector(selectDailyRange);
    const deviceViewPort = useSelector(selectCurrentDeviceViewPort);
    const [collapsed, setCollapsed] = useState(false);

    const handleClick = ({ key }) => {
        const route = routeMap[key];
        if (route) navigate(route);
    };

    const customTrigger = collapsed ? <FiChevronRight /> : <FiChevronLeft />;

    return (
        <Layout.Sider
            className="wx-sider"
            breakpoint="lg"
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            collapsedWidth={80}
            theme="dark"
            width={deviceViewPort === "XXL" ? 300 : 240}
            trigger={
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", height: "48px" }}>
                    {customTrigger}
                    {!collapsed && <span>Collapse</span>}
                </div>
            }
        >
            <Menu
                theme="dark"
                mode="inline"
                className="wx-sider-menu"
                items={menuItems}
                selectedKeys={[dailyRange]}
                onClick={handleClick}
            />
        </Layout.Sider>
    );
}
