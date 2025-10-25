// src/pages/HomePage/components/WeatherWidgetAnimated.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Row } from "antd";
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
import {iconByCode} from "@src/pages/HomePage/utils/weather-icons.js";

export default function Forecast({
                                     selectedLocation,
                                     setSelectedLocation,
                                     subline = "The low temperature will reach 25° on this gloomy day",
                                     daily = [],
                                     hourly = [],
                                 }) {
    const { ref: dragRef, dragging } = useDragScroll();

    // Robust arrays (თუ ჯერ undefined/obj მოდის)
    const dailyArr = Array.isArray(daily) ? daily : [];
    const hourlyArr = Array.isArray(hourly) ? hourly : [];

    // Default selection
    const initialDay =
        dailyArr?.[0]?.time ??
        (hourlyArr?.[0]?.time ? String(hourlyArr[0].time).split(" ")[0] : null);

    const [selectedDay, setSelectedDay] = useState(dailyArr?.[0] ?? null);
    const [selectedDayTime, setSelectedDayTime] = useState(initialDay);
    const [step, setStep] = useState("1h"); // "1h" | "3h"
    const [dailyRange, setDailyRange] = useState("7d"); // "7d" | "14d"

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
            let list = hourlyByDate.get(selectedDayTime);
            if (step === "3h") list = list.filter((_, i) => i % 3 === 0);
            return list;
        }
        const d = (dailyArr || []).find((x) => x.time === selectedDayTime) || dailyArr?.[0];
        if (!d) return [];
        const pseudo = buildPseudoHourlyForDay(d, 10);
        return step === "3h" ? pseudo.filter((_, i) => i % 3 === 0) : pseudo;
    }, [hourlyByDate, selectedDayTime, step, dailyArr]);

    // მარჯვენა სია: პირველი 7 ან 14 დღე
    const rightDays = useMemo(() => {
        const arr = Array.isArray(dailyArr) ? dailyArr : [];
        const count = dailyRange === "14d" ? 14 : 7;
        return arr.filter(Boolean).slice(0, count);
    }, [dailyArr, dailyRange]);

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
                    renderLabel={(d) => (
                        <>
                            <span className="ico">{iconByCode(d.pictocode)}</span>
                            <div className="meta">
                                <div className="day">{fmtDayLong(d.time)}</div>
                                <div className="desc">Partly Cloudy</div>
                            </div>
                            <div className="t">{Math.round(d.temperature_max)}°</div>
                        </>
                    )}
                />
            </motion.div>
        </Row>
    );
}
