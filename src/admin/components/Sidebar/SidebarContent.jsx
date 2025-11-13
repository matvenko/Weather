import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { connect, useDispatch, useSelector } from "react-redux";
import { logOut } from "../../../features/auth/authSlice";

import Sider from "antd/es/layout/Sider";
import s from "./sidebar.module.css";
import { AiOutlineLeft, AiOutlineLogout, AiOutlineRight } from "react-icons/ai";
import { VscColorMode } from "react-icons/vsc";
import SidebarUserSection from "./SidebarUserSection.jsx";
import { Menu } from "antd";
import MenuItem from "antd/es/menu/MenuItem.js";
import {
  selectCurrentState,
  setDarkSidebar,
  setCollapsed,
} from "../../../features/app/appSlice.js";
import {
  MdOutlineDashboard,
  MdOutlineImagesearchRoller,
  MdWatch,
} from "react-icons/md";
import { TbBrandStackshare } from "react-icons/tb";
import { usePermissions } from "@src/admin/providers/PermissionsProvider/index.js";
import { useMemo } from "react";

const SidebarContent = () => {
  const { t } = useTranslation();

  const state = useSelector(selectCurrentState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { permissions, isPageVisible } = usePermissions();

  const setDarkSidebarTheme = async () => {
    dispatch(setDarkSidebar());
  };

  const handleLogout = async (e) => {
    dispatch(logOut());
    navigate("/login");
  };

  const setCollapsedSidebar = async () => {
    dispatch(setCollapsed());
  };

  // Define all available menu items with their permissions
  const allMenuItems = useMemo(() => [
    {
      key: "/admin",
      icon: <MdOutlineDashboard />,
      label: "Dashboard",
      pageUrl: "dashboard", // This should match the pageUrl from API
    },
    {
      key: "/users",
      icon: <TbBrandStackshare />,
      label: "Users",
      pageUrl: "users",
    },
    {
      key: "/watches",
      icon: <MdWatch />,
      label: "Watches",
      pageUrl: "watches",
    },
  ], []);

  // Filter menu items based on permissions
  const visibleMenuItems = useMemo(() => {
    return allMenuItems.filter((item) => {
      // Always show dashboard
      if (item.pageUrl === "dashboard") return true;
      // Check if page is visible based on permissions
      return isPageVisible(item.pageUrl);
    });
  }, [allMenuItems, isPageVisible]);

  return (
    <>
      <Sider
        width={240}
        collapsed={state.collapsed}
        theme={state.darkSidebar ? "dark" : "light"}
        className={s.sidebar}
        style={{
          position: "fixed",
          left: 24,
          top: 24,
          bottom: 24,
        }}
      >
        <div
          onClick={setCollapsedSidebar}
          className={`${s.collapseArrow} ${
            state.darkSidebar === "dark" &&
            "darkBg darkColorGrey darkBorderGrey"
          }`}
          style={{
            zIndex: 200,
          }}
        >
          {state.collapsed ? <AiOutlineRight /> : <AiOutlineLeft />}
        </div>

        <SidebarUserSection
          collapsed={state.collapsed}
          sidebarTheme={state.sidebarTheme}
        />

        <div hidden={state.collapsed} className={s.sidebarSectionTitle}>
          Menu
        </div>

        <Menu
          theme={state.darkSidebar ? "dark" : "light"}
          mode="inline"
          defaultSelectedKeys={[window.location.pathname]}
          onClick={({ key }) => {
            navigate(key);
          }}
          items={visibleMenuItems}
        />
        <div className={s.menuFixedSection}>
          <div className={s.divider}></div>

          <Menu theme={state.darkSidebar ? "dark" : "light"} mode="inline">
            {/*<MenuItem*/}
            {/*  icon={<VscColorMode />}*/}
            {/*  onClick={() => {*/}
            {/*    setDarkSidebarTheme().then();*/}
            {/*  }}*/}
            {/*>*/}
            {/*  თემის შეცვლა*/}
            {/*</MenuItem>*/}
            <MenuItem
              icon={<AiOutlineLogout />}
              onClick={() => {
                handleLogout().then();
              }}
              style={{ color: "red" }}
            >
              გასვლა
            </MenuItem>
          </Menu>
        </div>
      </Sider>
    </>
  );
};

let mapStateToProps = (state) => ({
  authUserData: state.auth.user,
});

export default connect(mapStateToProps, {})(SidebarContent);
