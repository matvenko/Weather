import React from "react";
import s from "./sidebar.module.css";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@src/features/auth/authSlice.js";
import { getUserConfig } from "@src/utils/auth.js";
import meteoLogo from "@src/images/meteo-logo.png";
import "@src/admin/css/admin.css";
import {Divider} from "antd";

const SidebarUserSection = ({ collapsed, sidebarTheme }) => {
  const { t } = useTranslation();
  const userName = useSelector(selectCurrentUser);
  const userConfig = getUserConfig();
  const userRole = userConfig?.role?.dictionaryKey || userConfig?.role?.name || "მომხმარებელი";

  return (
    <div className={s.sidebarUserWrapper}>
      <Link to={"/"}>
        <div className={s.adminLogo}>
          <img
            src={meteoLogo}
            alt="Meteo Logo"
            style={{
              height: 'auto',
              objectFit: 'contain'
            }}
          />
        </div>
      </Link>
        <Divider />
      <div className={s.sidebarUserInfo} hidden={collapsed}>
        <p
          className={s.darkTextGrey}
        >
          {userRole}
        </p>
        <p
          className={`fs14 notoSansGeorgianBold ${
            sidebarTheme === "dark" && "darkTextWhite"
          }`}
        >
          {userName || "User"}
        </p>
      </div>
    </div>
  );
};

export default SidebarUserSection;
