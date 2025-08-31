import Sider from "antd/es/layout/Sider";
import s from "./sidebar.module.css";
import { AiOutlineLeft, AiOutlineLogout, AiOutlineRight } from "react-icons/ai";
import SidebarUserSection from "./SidebarUserSection";
import { useTranslation } from "react-i18next";
import { Badge, Menu } from "antd";
import SubMenu from "antd/es/menu/SubMenu";
import MenuItem from "antd/es/menu/MenuItem";

const CommonMenu = ({
  navPages,
  settingsMenuItems,
  sidebarTheme,
  authUserData,
  setCollapsedSidebar,
  collapsed,
  firstName,
  lastName,
  navigate,
  settingsAction,
  globalWarningMessage,
}) => {
  const { t } = useTranslation();

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
      <Sider
        width={240}
        collapsed={collapsed}
        theme={sidebarTheme}
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
            sidebarTheme === "dark" && "darkBg darkColorGrey darkBorderGrey"
          }`}
          style={{
            zIndex: 200,
          }}
        >
          {collapsed ? <AiOutlineRight /> : <AiOutlineLeft />}
        </div>

        <SidebarUserSection
          firstName={firstName}
          lastName={lastName}
          collapsed={collapsed}
          sidebarTheme={sidebarTheme}
          authUserData={authUserData}
        />

        <div
          hidden={!globalWarningMessage?.length > 0}
          className={s.globalWarningMessageSection}
        >
          {globalWarningMessage}
        </div>

        {/*navigation items*/}
        <div hidden={collapsed} className={s.sidebarSectionTitle}>
          {t("text.menu")}
        </div>

        <Menu
          mode="inline"
          defaultSelectedKeys={[window.location.pathname]}
          onClick={({ key }) => {
            navigate(key);
          }}
        >
          {navPages?.map((item) => renderMenuItem(item))}
        </Menu>
        <div className={s.menuFixedSection}>
          <div className={s.divider}></div>
          <div hidden={collapsed} className={s.sidebarSectionTitle}>
            {t("text.settings")}
          </div>

          <Menu
            theme={sidebarTheme}
            mode="inline"
            onClick={({ key }) => {
              settingsAction(key);
            }}
            items={settingsMenuItems}
            className={s.menuSettings}
          />

          <Menu theme={sidebarTheme} mode="inline">
            <MenuItem
              icon={<AiOutlineLogout />}
              onClick={() => {
                settingsAction("logout");
              }}
              style={{ color: "red" }}
            >
              {t("text._navigation._logout")}
            </MenuItem>
          </Menu>
        </div>
      </Sider>
    </>
  );
};

export default CommonMenu;
