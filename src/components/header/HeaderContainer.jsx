import React from "react";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./languageSelector/LanguageSelector.jsx";
import { Form } from "antd";
import DaytonaLogo from "../../images/img.png";
import { useLocation } from "react-router-dom";

const HeaderContainer = ({
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();


  let location = useLocation();
  let pathName = location.pathname;

  return (
    <>
      <div className="header-container">
        <div className={"daytona-logo"}>
          <a className="navbar-brand me-auto" href="/">
            <img src={DaytonaLogo} alt="daytona logo" width={80} />
          </a>
        </div>

        <nav className="header-menu">
          <a
            className={pathName === "/" ? "nav-link active" : "nav-link"}
            href="/"
            role="button"
            aria-expanded="false"
          >
            {t("text.watches")}
          </a>
          <a
            className={pathName === "/about" ? "nav-link active" : "nav-link"}
            href="/about"
          >
            {t("text.about")}
          </a>
          <a
            className={pathName === "/contact" ? "nav-link active" : "nav-link"}
            href="/contact"
          >
            {t("text.contact")}
          </a>
        </nav>
        <LanguageSelector />
      </div>
    </>
  );
};

export default HeaderContainer;
