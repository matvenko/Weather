import { Button } from "antd";
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

    onLang(i18n.language);                // ინიციალური მნიშვნელობა
    i18n.on("languageChanged", onLang);   // subscribe
    return () => i18n.off("languageChanged", onLang); // cleanup
  }, [i18n]);

  const toggle = async () => {
    await i18n.changeLanguage(lng === "en" ? "ka" : "en");
  };

  return (
      <Button
          type="text"
          className="language-btn"
          onClick={toggle}
          aria-label={lng === "en" ? "Switch language to Georgian" : "ენის შეცვლა ინგლისურზე"}
      >
        {lng === "en" ? "Eng" : "Geo"}
      </Button>
  );
}
