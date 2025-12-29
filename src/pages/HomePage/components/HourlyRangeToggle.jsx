import {useTranslation} from "react-i18next";
import {Tooltip} from "antd";

export default function HourlyRangeToggle({value, onChange, has1HourData = false}) {
    const {t, i18n} = useTranslation();

    // Tooltip text based on language
    const tooltipText = i18n.language === 'ka'
        ? 'პაკეტის შეძენა აუცილებელია 1 საათიანი პროგნოზისთვის'
        : 'Requires a paid package for 1-hour forecast';

    return (
        <div className="range-toggle">
            <Tooltip title={!has1HourData ? tooltipText : ''}>
                <button
                    type="button"
                    aria-pressed={value === "1h"}
                    className={value === "1h" ? "active" : ""}
                    onClick={() => has1HourData && onChange("1h")}
                    disabled={!has1HourData}
                    style={{
                        opacity: has1HourData ? 1 : 0.5,
                        cursor: has1HourData ? 'pointer' : 'not-allowed'
                    }}
                >
                    {t("hourly_view")}
                </button>
            </Tooltip>
            <button type="button" aria-pressed={value === "3h"} className={value === "3h" ? "active" : ""}
                    onClick={() => onChange("3h")}>
                {t("3_hourly_view")}
            </button>
        </div>
    );
}
