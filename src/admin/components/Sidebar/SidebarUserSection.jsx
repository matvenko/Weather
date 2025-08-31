import React from "react";
import s from "./sidebar.module.css";
import { AiOutlineBell } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const SidebarUserSection = ({ collapsed, sidebarTheme }) => {
  const { t } = useTranslation();
  return (
    <div className={s.sidebarUserWrapper}>
      <Link to={"/ProfileContainer"}>
        <div className={s.sidebarUsername}></div>
      </Link>
      <div className={s.sidebarUserInfo} hidden={collapsed}>
        <p
          className={`fs10 uppercaseText NotoSansGeorgianMedium ${
            sidebarTheme === "dark" && "darkTextGrey"
          }`}
        >
          Administrator
        </p>
        <p
          className={`fs14 notoSansGeorgianBold ${
            sidebarTheme === "dark" && "darkTextWhite"
          }`}
        >
          FirsTName
        </p>
      </div>
      <div className={s.sidebarBell}>
        <AiOutlineBell />
      </div>
    </div>
  );
};

export default SidebarUserSection;
