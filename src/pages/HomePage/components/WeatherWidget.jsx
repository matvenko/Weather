import React, {useMemo, useState} from "react";
import "../css/weatherWidjet.css";
import {Row} from "antd";
import useDragScroll from "@src/utils/useDragScroll.js";
import {IoIosThunderstorm} from "react-icons/io";

// --- utils ---
const toDate = (s) => new Date(String(s).replace(" ", "T")); // "YYYY-MM-DD hh:mm" -> Date
const fmtDayLong = (d) => toDate(d).toLocaleDateString([], {weekday: "long", month: "long", day: "numeric"});
const iconByCode = (code) => {
    const map = {1: "☀️", 2: "🌤️", 3: "⛅", 4: "☁️", 7: "🌦️", 16: "🌧️", 22: <IoIosThunderstorm />};
    return map[code] || "☁";
};

// daily -> pseudo hourly (fallback, როცა hourly არ გვაქვს)
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

// საათობრივი დავაჯგუფოთ დღედათ
function groupHourlyByDate(hourly = []) {
    const map = new Map();
    for (const h of hourly) {
        const [dateStr] = String(h.time).split(" ");
        if (!map.has(dateStr)) map.set(dateStr, []);
        map.get(dateStr).push(h);
    }
    // sort each day by time
    map.forEach((list) => list.sort((a, b) => toDate(a.time) - toDate(b.time)));
    return map; // Map<"YYYY-MM-DD", Hour[]>
}

const degToCompass = (deg) => {
    if (deg == null || isNaN(deg)) return "-";
    const dirs = ["N","NNE","NE","ENE","E","ESE","SE","SSE",
        "S","SSW","SW","WSW","W","WNW","NW","NNW"];
    return dirs[Math.round(deg / 22.5) % 16];
};

const msToKmh = (ms) => {
    const v = Number(ms);
    if (!Number.isFinite(v)) return "—";
    return Math.round(v * 3.6); // m/s -> km/h
};

// AM/PM სტაბილური ფორმატერი
const fmtHour = (d) => {
    const date = toDate(d);
    let h = date.getHours();
    const m = date.getMinutes();
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    const mm = String(m).padStart(2, "0");
    return `${String(h).padStart(2, "0")}:${mm} ${ampm}`;
};

const fmtPrecipMm = (mm, threeHour = false) => {
    if (mm == null) return "—";
    const v = Number(mm);
    if (!Number.isFinite(v)) return "—";
    if (v > 0 && v < 1) return "< 1";
    // API-ს precipitation უკვე mm-ებშია (1h). 3 საათიან ხედში აგრეგაცია თუ დაგჭირდება — შემატყობინე.
    return String(Math.round(v));
};

// SVG sparkline path
function useSparkline(values, {w = 680, h = 110, pad = 10} = {}) {
    return useMemo(() => {
        if (!values?.length) return {d: ""};
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
        return {d};
    }, [values, w, h, pad]);
}

export default function WeatherWidget({
                                          background = "https://t4.ftcdn.net/jpg/00/86/32/97/360_F_86329731_InK4rAy9AEUZfv5ntuXa1YwZETHn3giB.jpg",
                                          location = "Tbilisi, Georgia",
                                          headline = "Overcast cloudy",
                                          subline = "The low temperature will reach 25° on this gloomy day",
                                          daily = [],
                                          hourly = [],               // ✅ რეალური საათობრივი (მთელი კვირა)
                                          queryParams,
                                      }) {
    // "1h" | "3h"
    const [step, setStep] = useState("1h");

    const {ref: dragRef, dragging} = useDragScroll();
    console.log("hourly", hourly)

    // არჩეული დღე (default: პირველი daily)
    const defaultDay = daily?.[0]?.time ?? (hourly[0]?.time ? String(hourly[0].time).split(" ")[0] : null);
    const [selectedDay, setSelectedDay] = useState(defaultDay);

    // საათობრივი დავაჯგუფოთ დღედათ
    const hourlyByDate = useMemo(() => groupHourlyByDate(hourly), [hourly]);

    // არჩეული დღის საათობრივი
    const selectedHourly = useMemo(() => {
        if (hourlyByDate.size && selectedDay && hourlyByDate.get(selectedDay)?.length) {
            let list = hourlyByDate.get(selectedDay);
            if (step === "3h") {
                // ყოველი მესამე ჩანაწერი (ან შეგიძლია აგრეგაცია გააკეთო — საშუალო 3სთ ფანჯარაში)
                list = list.filter((_, i) => i % 3 === 0);
            }
            return list;
        }
        // fallback: თუ hourly არ გვაქვს, ავაგოთ daily-დან
        const d = (daily || []).find((x) => x.time === selectedDay) || daily?.[0];
        if (!d) return [];
        const pseudo = buildPseudoHourlyForDay(d, 10);
        return step === "3h" ? pseudo.filter((_, i) => i % 3 === 0) : pseudo;
    }, [hourlyByDate, selectedDay, step, daily]);

    const temps = selectedHourly.map((h) => Number(h.temperature));
    const {d: pathD} = useSparkline(temps);

    const rightDays = useMemo(() => (daily || []).slice(0, 7), [daily]);

    const cardStyle = useMemo(() => ({backgroundImage: `url(${background})`}), [background]);

    return (
        <Row>
            <div className="gw-wrap">
                {/* LEFT big card */}
                <div className="gw-hero">
                    <div className="gw-hero-inner" style={cardStyle}>
                        <div className="gw-badge">
                            <span className="dot">➤</span>
                            <span>{location}</span>
                        </div>

                        <div className="gw-hero-text">
                            <div className="kicker">Weather Forecast</div>
                            <h1>{headline}</h1>
                            <p className="sub">{subline}</p>
                        </div>

                        <div className="gw-hero-icon">☁</div>
                    </div>

                    {/* bottom stats band */}
                    <div className="gw-stats glass-soft">
                        <div className="hourly-wrapper">
                            <div className="stats-title">Today’s statistics</div>
                            <div className="range-toggle">
                                <button className={step === "1h" ? "active" : ""} onClick={() => setStep("1h")}>Hourly
                                    View
                                </button>
                                <button className={step === "3h" ? "active" : ""} onClick={() => setStep("3h")}>3 Hourly
                                    View
                                </button>
                            </div>
                        </div>

                        <div className="sparkline">
                            <svg viewBox="0 0 680 110" preserveAspectRatio="none">
                                <path className="line" d={pathD}/>
                                <path className="fill" d={`${pathD} L 680 110 L 0 110 Z`}/>
                            </svg>
                        </div>

                        {/* ჰორიზონტალური სქროლ-ტრეკი drag-ით */}
                        <div
                            ref={dragRef}
                            className={`stat-cards stat-cards--scroll drag-scroll ${dragging ? "is-dragging" : ""}`}
                        >
                            {selectedHourly.map((h, i) => (
                                <div key={i} className="stat-item">
                                    {/* icon ზედა მხარეს */}
                                    <div className="s-icon" title={h.pictocode}>
                                        {iconByCode(h.pictocode)}
                                    </div>

                                    {/* დიდი ტემპი ზოლზე */}
                                    <div className="s-temp-val">
                                        {Math.round(h.temperature)}°
                                    </div>

                                    {/* ამინდის დეტალები */}
                                    <div className="s-row">
                                        <span className="s-val">{degToCompass(h.winddirection)}</span>
                                    </div>
                                    <div className="s-row">
                                        <span className="s-val">{msToKmh(h.windspeed)} km/h</span>
                                    </div>
                                    <div className="s-row">
                                        <span className="s-val">{fmtPrecipMm(h.precipitation, step === "3h")}</span>
                                    </div>
                                    <div className="s-row">
                                        <span className="s-val">{Math.round(h.precipitation_probability ?? 0)}%</span>
                                    </div>

                                    <div className="s-time">{fmtHour(h.time)}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT panel */}
                <div className="gw-side glass">
                    <div className="side-top">
                        <div className="side-date">
                            {new Date().toLocaleDateString([], {weekday: "long", month: "long", day: "numeric"})}
                        </div>
                        <div className="side-temp">
                            {Math.round(daily?.[0]?.temperature_instant ?? daily?.[0]?.temperature_mean ?? 20)}°
                        </div>
                        <div className="side-wind">🍃 Northwest, 4.0 m/s</div>
                    </div>

                    <div className="side-next-title">The Next Day Forecast</div>

                    <ul className="side-list">
                        {rightDays.map((d) => {
                            const isActive = d.time === selectedDay;
                            return (
                                <li
                                    key={d.time}
                                    className={isActive ? "is-active" : ""}
                                    onClick={() => setSelectedDay(d.time)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => e.key === "Enter" && setSelectedDay(d.time)}
                                    title="Click to view hourly"
                                >
                                    <span className="ico">{iconByCode(d.pictocode)}</span>
                                    <div className="meta">
                                        <div className="day">{fmtDayLong(d.time)}</div>
                                        <div className="desc">Partly Cloudy</div>
                                    </div>
                                    <div className="t">{Math.round(d.temperature_max)}°</div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </Row>
    );
}
