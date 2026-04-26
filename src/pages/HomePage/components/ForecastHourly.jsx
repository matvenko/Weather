import React, {useMemo, useEffect} from "react";
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
import {getWeatherText, iconByCode, isNightTime} from "@src/pages/HomePage/utils/weather-icons.js";
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
 * - has1HourData: boolean - whether 1h data is available
 */
const ForecastHourly = ({
                            step = "1h", onChangeStep = () => {
    }, selectedHourly = [], has1HourData = false
                        }) => {
    const {ref: dragRef, dragging} = useDragScroll();
    const {t} = useTranslation();

    const { i18n } = useTranslation();

    const temps = useMemo(
        () => (selectedHourly || []).map(h => Number(h.temperature)).filter(Number.isFinite),
        [selectedHourly]
    );

    const isCurrentHour = (timeStr) => {
        if (!timeStr) return false;
        const now = new Date();
        const cardDate = new Date(timeStr);
        return cardDate.toDateString() === now.toDateString() && cardDate.getHours() === now.getHours();
    };

    useEffect(() => {
        if (!selectedHourly || selectedHourly.length === 0) return;

        const timer = setTimeout(() => {
            const currentHourCard = dragRef.current?.querySelector('.is-current-hour');
            if (currentHourCard && dragRef.current) {
                dragRef.current.scrollTo({
                    left: currentHourCard.offsetLeft - 22,
                    behavior: 'smooth'
                });
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [selectedHourly, dragRef]);

    return (
        <motion.div className="gw-stats glass-soft" variants={fadeUp}>
            <div className="hourly-wrapper">
                <div className="stats-title">{t('hourly_forecast')}</div>
                <HourlyRangeToggle value={step} onChange={onChangeStep} has1HourData={has1HourData}/>
            </div>

            {/* Sparkline */}
            <Sparkline values={temps}/>

            {/* ჰორიზონტალური scroll + stagger ბარათები */}
            <motion.div
                ref={dragRef}
                className={`stat-cards stat-cards--scroll drag-scroll ${dragging ? "is-dragging" : ""}`}
                variants={stagger(0.05, 0.05)}
            >
                {(selectedHourly || []).map((h, i) => {
                    const isNight = isNightTime(h.time);
                    const weatherText = getWeatherText(h.pictocode, i18n.language);
                    return (
                        <motion.div
                            key={`${h.time}-${i}`}
                            className={`stat-item ${isCurrentHour(h.time) ? "is-current-hour" : ""} ${isNight ? "is-night" : "is-day"}`}
                            variants={fadeUp}
                        >
                            <div className="s-icon" title={weatherText.desc}>
                                {iconByCode(h.pictocode, isNight)}
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
                    );
                })}
            </motion.div>
        </motion.div>
    );
};

export default ForecastHourly;
