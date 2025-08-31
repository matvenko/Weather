import React, { useState } from "react";
import { Badge, Drawer, Menu } from "antd";
import { AiOutlineMenu } from "react-icons/ai";
import SidebarUserSection from "./SidebarUserSection";
import s from "./sidebar.module.css";
import { useTranslation } from "react-i18next";
import SubMenu from "antd/es/menu/SubMenu";

const MobileMenu = ({
  navPages,
  sidebarTheme,
  collapsed,
  authUserData,
  lastName,
  firstName,
  settingsAction,
  navigate,
  settingsMenuItems,
}) => {
  const [openMenu, setOpenMenu] = useState(false);

  const renderTitle = () => (
    <SidebarUserSection
      firstName={firstName}
      lastName={lastName}
      collapsed={collapsed}
      sidebarTheme={sidebarTheme}
      authUserData={authUserData}
    />
  );

  return (
    <div className={"mobileHeader"}>
      <div onClick={() => setOpenMenu(!openMenu)}>
        <AiOutlineMenu className={"burger-bar-icon"} />
      </div>
      <Drawer
        className={"mobileMenu"}
        placement="left"
        title={renderTitle()}
        open={openMenu}
        onClose={() => {
          setOpenMenu(false);
        }}
      >
        <AppMenu
          navPages={navPages}
          navigate={navigate}
          sidebarTheme={sidebarTheme}
          setOpenMenu={setOpenMenu}
          settingsAction={settingsAction}
          settingsMenuItems={settingsMenuItems}
        />
      </Drawer>
    </div>
  );
};

function AppMenu({
  navPages,
  navigate,
  sidebarTheme,
  setOpenMenu,
  settingsAction,
  settingsMenuItems,
}) {
  const { t } = useTranslation();

  const onMenuItemClick = (item) => {
    setOpenMenu(false);
    navigate(item);
    setOpenMenu(false);
  };

  const renderMenuItem = (item) => {
    if (item?.children && item?.children?.length) {
      return (
        <SubMenu
          icon={item?.icon}
          key={item?.key}
          title={
            item?.count && item?.count > 0 ? (
              <Badge
                count={item.count}
                overflowCount={999}
                className={s.menuBadge}
                offset={[10, 10]}
              >
                {item?.label}
              </Badge>
            ) : (
              item?.label
            )
          }
        >
          {item?.children?.map((child) => renderMenuItem(child))}
        </SubMenu>
      );
    } else {
      return (
        <Menu.Item icon={item?.icon} key={item?.key}>
          {item?.count && item?.count > 0 ? (
            <Badge
              count={item.count}
              overflowCount={999}
              className={s.menuBadge}
              offset={[20, 6]}
            >
              {item?.label}
            </Badge>
          ) : (
            item?.label
          )}
        </Menu.Item>
      );
    }
  };
  return (
    <>
      <Menu
        mode="inline"
        defaultSelectedKeys={[window.location.pathname]}
        onClick={({ key }) => {
          onMenuItemClick(key);
        }}
      >
        {navPages?.map((item) => renderMenuItem(item))}
      </Menu>
      <div className={s.divider}></div>

      <div className={s.sidebarSectionTitle}>{t("text.settings")}</div>

      <Menu
        theme={sidebarTheme}
        mode="inline"
        onClick={({ key }) => {
          settingsAction(key);
        }}
        items={settingsMenuItems}
      />
    </>
  );
}

export default MobileMenu;
