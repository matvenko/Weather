import React, { useState, useMemo } from "react";
import { Layout, Menu } from "antd";
import {
    FiCloud, FiCamera, FiMap, FiBarChart2, FiNavigation,
    FiPackage, FiBook, FiTruck, FiLayers, FiRss,
} from "react-icons/fi";
import {useDispatch, useSelector} from "react-redux";
import {selectCurrentDeviceViewPort, setBackgroundFile} from "@src/features/app/appSlice.js";

const rawItems = [
    { key: "1",  icon: <FiCloud />,      label: "7-Day Weather",      bg: "./Mp4/morning-cloudy.mp4" },
    { key: "2",  icon: <FiCloud />,      label: "10-Day Weather",     bg: "./Mp4/nightStorm.mp4" },
    { key: "3",  icon: <FiBarChart2 />,  label: "Weather Today",      bg: "./Mp4/vazi.mp4" },
    { key: "4",  icon: <FiCamera />,     label: "Webcams",            bg: "./Mp4/cloudy.mp4" },
    { key: "5",  icon: <FiMap />,        label: "Weather Maps",       bg: "./Mp4/sunny.mp4" },
    { key: "6",  icon: <FiNavigation />, label: "Forecast",           bg: "./Mp4/night-snow.mp4" },
    { key: "7",  icon: <FiTruck />,      label: "Outdoor & Sports",   bg: "./Mp4/sea-sunset.mp4" },
    { key: "8",  icon: <FiNavigation />, label: "Aviation",           bg: "./Mp4/hard-rain.mp4" },
    { key: "9",  icon: <FiLayers />,     label: "Agriculture",        bg: "./Mp4/village-snow.mp4" },
    { key: "10", icon: <FiBook />,       label: "History & Climate",  bg: "./Mp4/rainy.mp4" },
    { key: "11", icon: <FiPackage />,    label: "Products",           bg: "./Mp4/products.mp4" },
    { key: "12", icon: <FiLayers />,     label: "Widgets",            bg: "./Mp4/mountains-snow.mp4" },
    { key: "13", icon: <FiRss />,        label: "News",               bg: "./Mp4/day-light-cloudy.mp4" },
];

export default function SiderNav() {
    const dispatch = useDispatch();
    const [selectedKey, setSelectedKey] = useState("1"); // საწყისი არჩეული (სურვილისამებრ)

    // antd-სთვის საჭიროა {key, icon, label}
    const menuItems = useMemo(
        () => rawItems.map(({ key, icon, label }) => ({ key, icon, label })),
        []
    );

    const handleClick = (e) => {
        const item = rawItems.find((it) => it.key === e.key);
        if (item?.bg) {
            dispatch(setBackgroundFile(item.bg));
            setSelectedKey(e.key);
        }
        // e.domEvent.preventDefault(); // არაა საჭირო, რადგან href არ გვაქვს
        // ნავიგაცია არ ხდება, რადგან navigate არ გვაქვს
    };

    const deviceViewPort = useSelector(selectCurrentDeviceViewPort)

    console.log("deviceViewPort", deviceViewPort)

    return (
        <Layout.Sider
            className="wx-sider"
            breakpoint="lg"
            collapsedWidth={0}
            theme="dark"
            width={deviceViewPort === "XXL" ? 300 : 240}
        >
            <Menu
                theme="dark"
                mode="inline"
                className={"wx-sider-menu"}
                items={menuItems}
                selectedKeys={[selectedKey]}
                onClick={handleClick}
            />
        </Layout.Sider>
    );
}
