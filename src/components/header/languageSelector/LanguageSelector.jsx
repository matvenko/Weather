import { Switch } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function LanguageSelector() {
  const { i18n } = useTranslation();
  const [lng, setLng] = useState((i18n.language || "ka").split("-")[0]);

  useEffect(() => {
    const onLang = (l) => {
      const lang = (l || "ka").split("-")[0];
      setLng(lang);
      document.documentElement.setAttribute("lang", lang);
      localStorage.setItem("lng", lang);
    };

    onLang(i18n.language);
    i18n.on("languageChanged", onLang);
    return () => i18n.off("languageChanged", onLang);
  }, [i18n]);

  const toggle = async (checked) => {
    await i18n.changeLanguage(checked ? "en" : "ka");
  };

  return (
      <Switch
          checked={lng === "en"}
          onChange={toggle}
          checkedChildren="Eng"
          unCheckedChildren="Geo"
          className="language-switch"
          aria-label={lng === "en" ? "Switch language to Georgian" : "Switch language to English"}
      />
  );
}
