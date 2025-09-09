import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import CommonMenu from "./CommonMenu";
import MobileMenu from "./MobileMenu";

const SidebarContainer = ({
  navPages,
  settingsMenuItems,
  sidebarTheme,
  collapsed,
  setCollapsedSidebar,
  setDarkSidebarTheme,
  changeLanguage,
  handleLogout,
  authUserData,
  deviceViewPort,
  globalWarningMessage,
}) => {
  const navigate = useNavigate();
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");

  const currentLanguage = Cookies.get("i18next") || "ka";
  useEffect(() => {
    setLastName(
      currentLanguage === "ka"
        ? authUserData.lastNameGe[0]
        : authUserData.lastNameEn[0],
    );
    setFirstName(
      currentLanguage === "ka"
        ? authUserData.firstNameGe[0]
        : authUserData.firstNameEn[0],
    );
  }, [
    currentLanguage,
    authUserData.firstNameEn,
    authUserData.firstNameGe,
    authUserData.lastNameEn,
    authUserData.lastNameGe,
  ]);

  const settingsAction = (key) => {
    if (key === "changeLang") {
      changeLanguage();
    } else if (key === "changeTheme") {
      setDarkSidebarTheme();
    } else if (key === "logout") {
      handleLogout();
    } else {
    }
  };

  return (
    <>
      {deviceViewPort !== "XS" ? (
        <CommonMenu
          collapsed={collapsed}
          sidebarTheme={sidebarTheme}
          setCollapsedSidebar={setCollapsedSidebar}
          firstName={firstName}
          lastName={lastName}
          authUserData={authUserData}
          navigate={navigate}
          navPages={navPages}
          settingsAction={settingsAction}
          settingsMenuItems={settingsMenuItems}
          globalWarningMessage={globalWarningMessage}
        />
      ) : (
        <MobileMenu
          collapsed={collapsed}
          sidebarTheme={sidebarTheme}
          setCollapsedSidebar={setCollapsedSidebar}
          firstName={firstName}
          lastName={lastName}
          authUserData={authUserData}
          navigate={navigate}
          navPages={navPages}
          settingsAction={settingsAction}
          settingsMenuItems={settingsMenuItems}
        />
      )}
    </>
  );
};

export default SidebarContainer;
