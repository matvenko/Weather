import {useTranslation} from "react-i18next";

export default function DailyRangeToggle({ value, onChange }) {
    const {t} = useTranslation();
    return (
        <div className="range-toggle">
            <button type="button" aria-pressed={value==="7d"} className={value==="7d" ? "active" : ""} onClick={() => onChange("7d")}>
                {t("one_week_forcast_view")}
            </button>
            <button type="button" aria-pressed={value==="14d"} className={value==="14d" ? "active" : ""} onClick={() => onChange("14d")}>
                {t("two_week_forcast_view")}
            </button>
        </div>
    );
}
