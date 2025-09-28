// WeatherWidgetAnimated.jsx
import React, { useMemo, useState } from "react";
import { Row } from "antd";
import { IoIosThunderstorm } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import useDragScroll from "@src/utils/useDragScroll.js";
import "../css/weatherWidjet.css";

/* ---------------- utils ---------------- */
const toDate = (s) => new Date(String(s).replace(" ", "T"));
const fmtDayLong = (d) => toDate(d).toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });
const iconByCode = (code) => {
    const map = { 1: "☀️", 2: "🌤️", 3: "⛅", 4: "☁️", 7: "🌦️", 16: "🌧️", 22: <IoIosThunderstorm /> };
    return map[code] || "☁";
};
function buildPseudoHourlyForDay(d, points = 8) {
    const arr = [];
    for (let i = 0; i < points; i++) {
        const hour = 9 + i;
        arr.push({
            time: `${d.time} ${String(hour).padStart(2, "0")}:00`,
            temperature: (Number(d.temperature_min) + Number(d.temperature_max)) / 2,
            pictocode: d.pictocode,
        });
    }
    return arr;
}
function groupHourlyByDate(hourly = []) {
    const map = new Map();
    for (const h of hourly) {
        const [dateStr] = String(h.time).split(" ");
        if (!map.has(dateStr)) map.set(dateStr, []);
        map.get(dateStr).push(h);
    }
    map.forEach((list) => list.sort((a, b) => toDate(a.time) - toDate(b.time)));
    return map;
}
const degToCompass = (deg) => {
    if (deg == null || isNaN(deg)) return "-";
    const dirs = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
    return dirs[Math.round(deg / 22.5) % 16];
};
const msToKmh = (ms) => {
    const v = Number(ms);
    if (!Number.isFinite(v)) return "—";
    return Math.round(v * 3.6);
};
const fmtHour = (d) => {
    const date = toDate(d);
    let h = date.getHours();
    const m = date.getMinutes();
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    const mm = String(m).padStart(2, "0");
    return `${String(h).padStart(2, "0")}:${mm} ${ampm}`;
};
const fmtPrecipMm = (mm) => {
    if (mm == null) return "—";
    const v = Number(mm);
    if (!Number.isFinite(v)) return "—";
    if (v > 0 && v < 1) return "< 1";
    return String(Math.round(v));
};
function useSparkline(values, { w = 680, h = 110, pad = 10 } = {}) {
    return useMemo(() => {
        if (!values?.length) return { d: "" };
        const min = Math.min(...values);
        const max = Math.max(...values);
        const span = max - min || 1;
        const stepX = (w - pad * 2) / (values.length - 1 || 1);
        const yScale = (v) => h - pad - ((v - min) / span) * (h - pad * 2);
        const pts = values.map((v, i) => [pad + i * stepX, yScale(v)]);
        const d = pts.reduce((acc, [x, y], i, arr) => {
            if (i === 0) return `M ${x} ${y}`;
            const [px, py] = arr[i - 1];
            const cx1 = px + (x - px) * 0.35;
            const cy1 = py;
            const cx2 = px + (x - px) * 0.65;
            const cy2 = y;
            return acc + ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x} ${y}`;
        }, "");
        return { d };
    }, [values, w, h, pad]);
}

/* --------------- animation variants --------------- */
const fadeUp = {
    hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
const staggerCol = {
    hidden: {},
    show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};
const floatIcon = {
    hidden: { opacity: 0, scale: 0.9, rotate: -3 },
    show: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};
const heroZoom = {
    hidden: { opacity: 0, scale: 1.02 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};
const listItem = {
    hidden: { opacity: 0, x: 10 },
    show: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" } },
};
const drawLine = {
    hidden: { pathLength: 0 },
    show: { pathLength: 1, transition: { duration: 1.2, ease: "easeInOut" } },
};

export default function WeatherWidget({
                                          background = "https://t4.ftcdn.net/jpg/00/86/32/97/360_F_86329731_InK4rAy9AEUZfv5ntuXa1YwZETHn3giB.jpg",
                                          location = "Tbilisi, Georgia",
                                          headline = "Overcast cloudy",
                                          subline = "The low temperature will reach 25° on this gloomy day",
                                          daily = [],
                                          hourly = [],
                                      }) {
    const [step, setStep] = useState("1h");
    const { ref: dragRef, dragging } = useDragScroll();

    const defaultDay = daily?.[0]?.time ?? (hourly[0]?.time ? String(hourly[0].time).split(" ")[0] : null);
    const [selectedDay, setSelectedDay] = useState(defaultDay);

    const hourlyByDate = useMemo(() => groupHourlyByDate(hourly), [hourly]);

    const selectedHourly = useMemo(() => {
        if (hourlyByDate.size && selectedDay && hourlyByDate.get(selectedDay)?.length) {
            let list = hourlyByDate.get(selectedDay);
            if (step === "3h") list = list.filter((_, i) => i % 3 === 0);
            return list;
        }
        const d = (daily || []).find((x) => x.time === selectedDay) || daily?.[0];
        if (!d) return [];
        const pseudo = buildPseudoHourlyForDay(d, 10);
        return step === "3h" ? pseudo.filter((_, i) => i % 3 === 0) : pseudo;
    }, [hourlyByDate, selectedDay, step, daily]);

    const temps = selectedHourly.map((h) => Number(h.temperature));
    const { d: pathD } = useSparkline(temps);
    const rightDays = useMemo(() => (daily || []).slice(0, 7), [daily]);
    const cardStyle = useMemo(() => ({ backgroundImage: `url(${background})` }), [background]);

    return (
        <Row>
            <motion.div
                className="gw-wrap"
                initial="hidden"
                animate="show"
                variants={staggerCol}
            >
                {/* LEFT big card */}
                <div className="gw-hero">
                    <motion.div className="gw-hero-inner" style={cardStyle} variants={heroZoom}>
                        <motion.div className="gw-badge" variants={fadeUp}>
                            <span className="dot">➤</span>
                            <span>{location}</span>
                        </motion.div>

                        <motion.div className="gw-hero-text" variants={staggerCol}>
                            <motion.div className="kicker" variants={fadeUp}>Weather Forecast</motion.div>
                            <motion.h1 variants={fadeUp}>{headline}</motion.h1>
                            <motion.p className="sub" variants={fadeUp}>{subline}</motion.p>
                        </motion.div>

                        <motion.div className="gw-hero-icon" variants={floatIcon}>☁</motion.div>
                    </motion.div>

                    {/* bottom stats band */}
                    <motion.div className="gw-stats glass-soft" variants={fadeUp}>
                        <div className="hourly-wrapper">
                            <div className="stats-title">Today’s statistics</div>
                            <div className="range-toggle">
                                <button className={step === "1h" ? "active" : ""} onClick={() => setStep("1h")}>Hourly View</button>
                                <button className={step === "3h" ? "active" : ""} onClick={() => setStep("3h")}>3 Hourly View</button>
                            </div>
                        </div>

                        <div className="sparkline">
                            <svg viewBox="0 0 680 110" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="gw-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="currentColor" stopOpacity="0.45" />
                                        <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <AnimatePresence mode="wait">
                                    <motion.path
                                        key={`line-${step}-${selectedDay}-${temps.join(",")}`}
                                        className="line"
                                        d={pathD || "M0 110 L680 110"}
                                        style={{ pathLength: 0 }}
                                        variants={drawLine}
                                        initial="hidden"
                                        animate="show"
                                        exit="hidden"
                                    />
                                </AnimatePresence>
                                <path className="fill" d={`${pathD} L 680 110 L 0 110 Z`} />
                            </svg>
                        </div>

                        {/* ჰორიზონტალური scroll + stagger ბარათები */}
                        <motion.div
                            ref={dragRef}
                            className={`stat-cards stat-cards--scroll drag-scroll ${dragging ? "is-dragging" : ""}`}
                            variants={staggerCol}
                        >
                            {selectedHourly.map((h, i) => (
                                <motion.div key={`${h.time}-${i}`} className="stat-item" variants={fadeUp}>
                                    <div className="s-icon" title={h.pictocode}>
                                        {iconByCode(h.pictocode)}
                                    </div>
                                    <div className="s-temp-val">{Math.round(h.temperature)}°</div>
                                    <div className="s-row"><span className="s-val">{degToCompass(h.winddirection)}</span></div>
                                    <div className="s-row"><span className="s-val">{msToKmh(h.windspeed)} km/h</span></div>
                                    <div className="s-row"><span className="s-val">{fmtPrecipMm(h.precipitation)}</span></div>
                                    <div className="s-row"><span className="s-val">{Math.round(h.precipitation_probability ?? 0)}%</span></div>
                                    <div className="s-time">{fmtHour(h.time)}</div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>

                {/* RIGHT panel */}
                <motion.aside className="gw-side glass" variants={staggerCol}>
                    <motion.div className="side-top" variants={fadeUp}>
                        <div className="side-date">
                            {new Date().toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}
                        </div>
                        <div className="side-temp">
                            {Math.round(daily?.[0]?.temperature_instant ?? daily?.[0]?.temperature_mean ?? 20)}°
                        </div>
                        <div className="side-wind">🍃 Northwest, 4.0 m/s</div>
                    </motion.div>

                    <motion.div className="side-next-title" variants={fadeUp}>The Next Day Forecast</motion.div>

                    <motion.ul className="side-list" variants={staggerCol}>
                        {rightDays.map((d) => {
                            const isActive = d.time === selectedDay;
                            return (
                                <motion.li
                                    key={d.time}
                                    className={isActive ? "is-active" : ""}
                                    onClick={() => setSelectedDay(d.time)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => e.key === "Enter" && setSelectedDay(d.time)}
                                    title="Click to view hourly"
                                    variants={listItem}
                                >
                                    <span className="ico">{iconByCode(d.pictocode)}</span>
                                    <div className="meta">
                                        <div className="day">{fmtDayLong(d.time)}</div>
                                        <div className="desc">Partly Cloudy</div>
                                    </div>
                                    <div className="t">{Math.round(d.temperature_max)}°</div>
                                </motion.li>
                            );
                        })}
                    </motion.ul>
                </motion.aside>
            </motion.div>
        </Row>
    );
}
