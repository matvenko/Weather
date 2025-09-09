import Cookies from "js-cookie";
import i18next from "i18next";

export const changeLanguage = () => {
  const currentLanguage = Cookies.get("i18next") || "en";
  let lang = currentLanguage === "en" ? "ge" : "en";
  i18next.changeLanguage(lang).then();
};
