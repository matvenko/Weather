import React, { useMemo, useState } from "react";
import "../css/weatherWidjet.css";
import {Row} from "antd";

// --- utils ---
const wd = (d) => new Date(d);
const fmtDayLong = (d) => wd(d).toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });
const fmtHour = (d) => wd(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const iconByCode = (code) => {
    const map = { 1:"☀️", 2:"🌤️", 3:"⛅", 4:"☁", 7:"🌦️", 16:"🌧️" };
    return map[code] || "🌡️";
};

// რაცHourly ჯერ არ გაქვს, ვაგენერირებთ daily-დან ვიზუალისთვის
function buildPseudoHourly(daily, points = 8) {
    return (daily || []).slice(0, points).map((d, i) => ({
        time: d.time + "T" + String(9 + i).padStart(2, "0") + ":00:00",
        temperature: (Number(d.temperature_min) + Number(d.temperature_max)) / 2,
        pictocode: d.pictocode,
        label: d.pictocode, // optional
    }));
}

// SVG sparkline path
function useSparkline(values, { w = 680, h = 110, pad = 10 } = {}) {
    return useMemo(() => {
        if (!values || values.length === 0) return { d: "", min: 0, max: 0 };
        const min = Math.min(...values);
        const max = Math.max(...values);
        const span = max - min || 1;
        const stepX = (w - pad * 2) / (values.length - 1 || 1);
        const yScale = (v) => h - pad - ((v - min) / span) * (h - pad * 2);

        const pts = values.map((v, i) => [pad + i * stepX, yScale(v)]);
        // რბილი კუბიკური (cardinal-ish) მრუდი
        const d = pts.reduce((acc, [x, y], i, arr) => {
            if (i === 0) return `M ${x} ${y}`;
            const [px, py] = arr[i - 1];
            const cx1 = px + (x - px) * 0.35;
            const cy1 = py;
            const cx2 = px + (x - px) * 0.65;
            const cy2 = y;
            return acc + ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x} ${y}`;
        }, "");
        return { d, min, max };
    }, [values, w, h, pad]);
}

// --- component ---
export default function GlassWeather({
                                         background = "https://t4.ftcdn.net/jpg/00/86/32/97/360_F_86329731_InK4rAy9AEUZfv5ntuXa1YwZETHn3giB.jpg",
                                         location = "Tbilisi, Georgia",
                                         headline = "Overcast cloudy",
                                         subline = "The low temperature will reach 25° on this gloomy day",
                                         // API data
                                         daily = [],
                                         hourly, // optional
                                     }) {
    const [range, setRange] = useState("4"); // "4" | "7"

    console.log("daily", daily)

    const rightDays = useMemo(
        () => (range === "4" ? (daily || []).slice(0, 4) : (daily || []).slice(0, 7)),
        [daily, range]
    );

    const hourlyData = useMemo(
        () => (hourly && hourly.length ? hourly.slice(0, 8) : buildPseudoHourly(daily, 8)),
        [hourly, daily]
    );

    console.log("hourlyData", hourlyData)

    const temps = hourlyData.map((h) => Number(h.temperature));
    const { d: pathD } = useSparkline(temps);

    const cardStyle = useMemo(
        () => ({
            backgroundImage: `url(${background})`,
        }),
        [background]
    );

    return (
        <Row>
            <div className="gw-wrap">
                {/* LEFT big card */}
                <div className="gw-hero" >
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
                        <div className="stats-title">Today’s statistics</div>

                        <div className="sparkline">
                            <svg viewBox="0 0 680 110" preserveAspectRatio="none">
                                <path className="line" d={pathD} />
                                {/* რბილი ფონი ქვემოთ */}
                                <path className="fill" d={`${pathD} L 680 110 L 0 110 Z`} />
                            </svg>
                        </div>

                        <div className="stat-cards">
                            {hourlyData.map((h, i) => (
                                <div key={i} className="stat-item">
                                    <div className="val">{Math.round(h.temperature)}°</div>
                                    <div className="time">{fmtHour(h.time)}</div>
                                    <div className="desc">Partly Cloudy</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT panel */}
                <div className="gw-side glass">
                    <div className="side-top">
                        <div className="side-date">
                            {wd(Date.now()).toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}
                        </div>
                        <div className="side-temp">
                            {Math.round(daily?.[0]?.temperature_instant ?? daily?.[0]?.temperature_mean ?? 20)}°
                        </div>
                        <div className="side-wind">🍃 Northwest, 4.0 m/s</div>
                    </div>

                    <div className="side-next-title">The Next Day Forecast</div>
                    <div className="range-toggle">
                        <button className={range === "4" ? "active" : ""} onClick={() => setRange("4")}>4 days</button>
                        <button className={range === "7" ? "active" : ""} onClick={() => setRange("7")}>7 days</button>
                    </div>

                    <ul className="side-list">
                        {rightDays.map((d) => (
                            <li key={d.time}>
                                <span className="ico">{iconByCode(d.pictocode)}</span>
                                <div className="meta">
                                    <div className="day">{fmtDayLong(d.time)}</div>
                                    <div className="desc">Partly Cloudy</div>
                                </div>
                                <div className="t">{Math.round(d.temperature_max)}°</div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </Row>
    );
}
