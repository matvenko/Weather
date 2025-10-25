import {useTranslation} from "react-i18next";

export default function HourlyRangeToggle({value, onChange}) {
    const {t} = useTranslation();
    return (
        <div className="range-toggle">
            <button type="button" aria-pressed={value === "1h"} className={value === "1h" ? "active" : ""}
                    onClick={() => onChange("1h")}>
                {t("hourly_view")}
            </button>
            <button type="button" aria-pressed={value === "3h"} className={value === "3h" ? "active" : ""}
                    onClick={() => onChange("3h")}>
                {t("3_hourly_view")}
            </button>
        </div>
    );
}
