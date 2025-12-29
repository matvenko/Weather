// src/pages/HomePage/components/WeatherWidgetAnimated.jsx
import React, { useEffect, useMemo, useState } from "react";
import {Divider, Row, Tooltip} from "antd";
import { motion } from "framer-motion";
import useDragScroll from "@src/utils/useDragScroll.js";
import "../css/Forecast.css";

import {
    buildPseudoHourlyForDay,
    groupHourlyByDate,
    fmtDayLong,
} from "@src/pages/HomePage/utils/homepage-utils.js";

import { staggerCol } from "@src/ui/motion/variants.js";
import ForecastDaily from "@src/pages/HomePage/components/ForecastDaily.jsx";
import ForecastHero from "@src/pages/HomePage/components/ForecastHero.jsx";
import ForecastHourly from "@src/pages/HomePage/components/ForecastHourly.jsx";
import {iconByCode, getWeatherText} from "@src/pages/HomePage/utils/weather-icons.js";
import {getTemperatureColor} from "@src/pages/HomePage/utils/temperature-colors.js";
import {useTranslation} from "react-i18next";

export default function Forecast({
                                     selectedLocation,
                                     setSelectedLocation,
                                     subline = "The low temperature will reach 25° on this gloomy day",
                                     dailyData = {},
                                     hourlyData = {},
                                 }) {
    const { ref: dragRef, dragging } = useDragScroll();
    const { i18n } = useTranslation();
    const [dailyRange, setDailyRange] = useState("7d"); // "7d" | "14d"
    const [step, setStep] = useState("1h"); // "1h" | "3h"

    // Extract arrays from new API response structure for daily data
    const sevenDayData = Array.isArray(dailyData?.["7day"]) ? dailyData["7day"] : [];
    const fourteenDayData = Array.isArray(dailyData?.["14day"]) ? dailyData["14day"] : [];

    // Extract arrays from new API response structure for hourly data
    const oneHourData = Array.isArray(hourlyData?.["1h"]) ? hourlyData["1h"] : [];
    const threeHourData = Array.isArray(hourlyData?.["3h"]) ? hourlyData["3h"] : [];

    // Choose the appropriate array based on dailyRange and step
    const dailyArr = dailyRange === "14d" ? fourteenDayData : sevenDayData;
    const hourlyArr = step === "3h" ? threeHourData : oneHourData;

    // Check if 14-day data is available
    const has14DayData = fourteenDayData.length > 0;

    // Default selection
    const initialDay =
        dailyArr?.[0]?.time ??
        (hourlyArr?.[0]?.time ? String(hourlyArr[0].time).split(" ")[0] : null);

    const [selectedDay, setSelectedDay] = useState(dailyArr?.[0] ?? null);
    const [selectedDayTime, setSelectedDayTime] = useState(initialDay);

    // როცა daily იცვლება, გადააყვანინე არჩევანი პირველ დღეზე
    useEffect(() => {
        if (dailyArr.length > 0) {
            setSelectedDay(dailyArr[0]);
            setSelectedDayTime(dailyArr[0].time);
        }
    }, [dailyArr]);

    // ჯგუფდება საათობრივი მონაცემები
    const hourlyByDate = useMemo(() => groupHourlyByDate(hourlyArr), [hourlyArr]);

    // ამორჩეული დღის საათობრივი სია (ან pseudo-hourly თუ ვერ მივაგენით)
    const selectedHourly = useMemo(() => {
        if (hourlyByDate.size && selectedDayTime && hourlyByDate.get(selectedDayTime)?.length) {
            // API უკვე აბრუნებს გაფილტრულ მონაცემებს (1h ან 3h)
            return hourlyByDate.get(selectedDayTime);
        }
        const d = (dailyArr || []).find((x) => x.time === selectedDayTime) || dailyArr?.[0];
        if (!d) return [];
        const pseudo = buildPseudoHourlyForDay(d, 10);
        // pseudo data-სთვის კვლავ ვაკეთებთ ფილტრაციას
        return step === "3h" ? pseudo.filter((_, i) => i % 3 === 0) : pseudo;
    }, [hourlyByDate, selectedDayTime, step, dailyArr]);

    // მარჯვენა სია: dailyArr უკვე შეიცავს სწორ მონაცემებს (7day ან 14day)
    const rightDays = useMemo(() => {
        return dailyArr.filter(Boolean);
    }, [dailyArr]);

    return (
        <Row>
            <motion.div className="gw-wrap" initial="hidden" animate="show" variants={staggerCol}>
                {/* LEFT column */}
                <div className="gw-hero">
                    {/* Hero card */}
                    <ForecastHero
                        selectedLocation={selectedLocation}
                        setSelectedLocation={setSelectedLocation}
                        subline={subline}
                        selectedDay={selectedDay}
                    />

                    {/* Bottom stats band */}
                    <ForecastHourly
                        step={step}
                        onChangeStep={setStep}
                        selectedHourly={selectedHourly}
                    />
                </div>

                {/* RIGHT column (aside) */}
                <ForecastDaily
                    items={rightDays}
                    isActive={(d) => d.time === selectedDayTime}
                    onSelect={(d) => {
                        setSelectedDayTime(d.time);
                        setSelectedDay(d);
                    }}
                    dailyRange={dailyRange}
                    onChangeStep={setDailyRange}
                    has14DayData={has14DayData}
                    renderLabel={(d) => {
                        const weatherText = getWeatherText(d.pictocode, i18n.language);
                        return (
                            <>
                                <span className="ico">{iconByCode(d.pictocode)}</span>
                                <div className="meta">
                                    <div className="day">{fmtDayLong(d.time)}</div>
                                    <div className="desc">{weatherText.desc}</div>
                                </div>

                                <div>
                                    <Tooltip title="max temperature">
                                        <div className="t" style={{ color: getTemperatureColor(d.temperature_max) }}>
                                            {Math.round(d.temperature_max)}°
                                        </div>
                                    </Tooltip>

                                    {/*<Divider className={"m-0"}  style={{margin: "0 !important"}} type="vertical" />*/}

                                    <Tooltip title="min temperature">
                                        <div className="t" style={{ color: getTemperatureColor(d.temperature_min) }}>
                                            {Math.round(d.temperature_min)}°
                                        </div>
                                    </Tooltip>
                                </div>
                            </>
                        );
                    }}
                />
            </motion.div>
        </Row>
    );
}
