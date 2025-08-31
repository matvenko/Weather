import i18next from "i18next";
import { Button } from "antd";
import Cookies from "js-cookie";

export default function LanguageSelector() {
  const currentLanguage = Cookies.get("i18next") || "ge";
  let langLabel = currentLanguage === "en" ? "Eng" : "Geo";
  return (
    <Button
      type={"text"}
      className={"language-btn"}
      onClick={() =>
        i18next.changeLanguage(currentLanguage === "en" ? "ge" : "en").then()
      }
    >
      {langLabel}
    </Button>
  );
}
