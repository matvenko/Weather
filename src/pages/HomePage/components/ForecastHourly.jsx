import React, {useMemo} from "react";
import {motion} from "framer-motion";
import {fadeUp, stagger} from "@src/ui/motion/variants.js";
import HourlyRangeToggle from "@src/pages/HomePage/components/HourlyRangeToggle.jsx";
import Sparkline from "@src/pages/HomePage/components/Sparkline.jsx";
import useDragScroll from "@src/utils/useDragScroll.js";
import {
    degToCompass,
    fmtHour,
    fmtPrecipMm,
    msToKmh,
} from "@src/pages/HomePage/utils/homepage-utils.js";
import {iconByCode} from "@src/pages/HomePage/utils/weather-icons.js";
import {useTranslation} from "react-i18next";
import {
    WindDirectionIcon,
    WindSpeedIcon,
    PrecipitationIcon,
    PrecipitationProbabilityIcon,
} from "@src/pages/HomePage/components/WeatherDetailIcons.jsx";
import {getTemperatureColor} from "@src/pages/HomePage/utils/temperature-colors.js";
import RainspotBadge from "@src/pages/HomePage/components/RainspotBadge.jsx";

/**
 * Props:
 * - step: "1h" | "3h"
 * - onChangeStep: (val) => void
 * - selectedHourly: array of hourly points
 */
const ForecastHourly = ({
                            step = "1h", onChangeStep = () => {
    }, selectedHourly = []
                        }) => {
    const {ref: dragRef, dragging} = useDragScroll();
    const {t} = useTranslation();

    const temps = useMemo(
        () => (selectedHourly || []).map(h => Number(h.temperature)).filter(Number.isFinite),
        [selectedHourly]
    );

    return (
        <motion.div className="gw-stats glass-soft" variants={fadeUp}>
            <div className="hourly-wrapper">
                <div className="stats-title">{t('hourly_forecast')}</div>
                <HourlyRangeToggle value={step} onChange={onChangeStep}/>
            </div>

            {/* Sparkline */}
            <Sparkline values={temps}/>

            {/* ჰორიზონტალური scroll + stagger ბარათები */}
            <motion.div
                ref={dragRef}
                className={`stat-cards stat-cards--scroll drag-scroll ${dragging ? "is-dragging" : ""}`}
                variants={stagger(0.05, 0.05)}
            >
                {(selectedHourly || []).map((h, i) => (
                    <motion.div key={`${h.time}-${i}`} className="stat-item" variants={fadeUp}>
                        <div className="s-icon" title={String(h.pictocode)}>
                            {iconByCode(h.pictocode)}
                        </div>

                        <div className="s-temp-val" style={{
                            color: getTemperatureColor(Number(h.temperature))
                        }}>
                            {Number.isFinite(Number(h.temperature)) ? Math.round(h.temperature) : "—"}°
                        </div>

                        <div className="s-row">
                            <WindDirectionIcon size={14} direction={h.winddirection}/>
                            <span className="s-val">{degToCompass(h.winddirection)}</span>
                        </div>
                        <div className="s-row">
                            <WindSpeedIcon size={14}/>
                            <span className="s-val">
                {Number.isFinite(Number(h.windspeed)) ? msToKmh(h.windspeed) : "—"} km/h
              </span>
                        </div>
                        <div className="s-row">
                            <PrecipitationIcon size={14}/>
                            <span className="s-val">{fmtPrecipMm(h.precipitation)}</span>
                        </div>
                        <div className="s-row">
                            <PrecipitationProbabilityIcon size={14}/>
                            <span className="s-val">
                {Math.round(h.precipitation_probability ?? 0)}%
              </span>
                        </div>
                        {(h.rainspot ?? "").length > 0 && (
                            <motion.div className="rainspot-box" variants={fadeUp}>
                                <div className="rainspot-icon">
                                    <RainspotBadge rainspot={h.rainspot} tile={12} round={10}/>
                                </div>
                            </motion.div>
                        )}
                        <div className="s-time">{fmtHour(h.time)}</div>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
};

export default ForecastHourly;
