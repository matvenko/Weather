import {useTranslation} from "react-i18next";
import {Tooltip} from "antd";

export default function DailyRangeToggle({ value, onChange, has14DayData = false }) {
    const {t, i18n} = useTranslation();

    // Tooltip text based on language
    const tooltipText = i18n.language === 'ka'
        ? 'პაკეტის შეძენა აუცილებელია 14 დღიანი პროგნოზისთვის'
        : 'Requires a paid package for 14-day forecast';

    return (
        <div className="range-toggle">
            <button type="button" aria-pressed={value==="7d"} className={value==="7d" ? "active" : ""} onClick={() => onChange("7d")}>
                {t("one_week_forcast_view")}
            </button>
            <Tooltip title={!has14DayData ? tooltipText : ''}>
                <button
                    type="button"
                    aria-pressed={value==="14d"}
                    className={value==="14d" ? "active" : ""}
                    onClick={() => has14DayData && onChange("14d")}
                    disabled={!has14DayData}
                    style={{
                        opacity: has14DayData ? 1 : 0.5,
                        cursor: has14DayData ? 'pointer' : 'not-allowed'
                    }}
                >
                    {t("two_week_forcast_view")}
                </button>
            </Tooltip>
        </div>
    );
}
