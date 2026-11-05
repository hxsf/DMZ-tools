import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import zhCN from "./locales/zh-CN";
import en from "./locales/en";

export function initializeI18n() {
  return i18n.use(initReactI18next).init({
    resources: { "zh-CN": { translation: zhCN }, en: { translation: en } },
    lng: "zh-CN",
    fallbackLng: "zh-CN",
    supportedLngs: ["zh-CN", "en"],
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });
}

export default i18n;
