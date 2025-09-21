import React, { useMemo } from "react";
import "../css/weatherWidjet.css";

function fmtTime(dtStr) {
    const d = new Date(dtStr);
    return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}
function fmtWeekday(dtStr) {
    const d = new Date(dtStr);
    return d.toLocaleDateString([], { weekday: "long" });
}
function fmtShortHour(dtStr) {
    const d = new Date(dtStr);
    return d.toLocaleTimeString([], { hour: "numeric" });
}
function degToCompass(num) {
    if (typeof num !== "number") return "-";
    const val = Math.floor(num / 22.5 + 0.5);
    const arr = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S",
        "SSW","SW","WSW","W","WNW","NW","NNW"];
    return arr[val % 16];
}
function iconFromPictocode(code) {
    // placeholder emoji; ჩაანაცვლე შენს SVG-ებით
    const map = {
        1:"☀️",2:"🌤️",3:"⛅",4:"☁️",7:"🌦️",16:"🌧️"
    };
    return map[code] || "🌀";
}

export default function MetroWeatherWidget({
                                               locationName = "Tbilisi",
                                               nowLabel = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
                                               backgroundImage, // URL (ಐচ্ছಿಕი)
                                               current = {
                                                   temperature: 20,
                                                   description: "Overcast",
                                                   precipitation_probability: 20,
                                                   relativehumidity: 60,
                                                   windspeed: 4,
                                                   winddirection: 315,
                                               },
                                               // daily: [{ time:"2025-09-21", temperature_max:..., temperature_min:..., pictocode:..., ... }]
                                               daily = [],
                                               // hourly: [{ time:"2025-09-21T10:00:00", temperature: 23, pictocode: 3 }, ...]
                                               hourly = [],
                                               // მარცხენა მხარეს ქალაქების quick-list (დემო).
                                               quickList = [
                                                   { label: "Chicago", time: "2025-09-21T09:00:00", temp: 20 },
                                                   { label: "Miami", time: "2025-09-21T10:00:00", temp: 25 },
                                                   { label: "Paris", time: "2025-09-21T12:00:00", temp: 30 },
                                                   { label: "Houston", time: "2025-09-21T11:00:00", temp: 35 },
                                                   { label: "Barcelona", time: "2025-09-21T15:00:00", temp: 15 },
                                                   { label: "Hawaii", time: "2025-09-21T18:00:00", temp: 35 },
                                               ],
                                               onSearch, // (q) => void
                                           }) {
    const bgStyle = useMemo(
        () => ({
            backgroundImage: `url(${backgroundImage})`,
        }),
        [backgroundImage]
    );

    return (
        <div className="mw-wrap">
            {/* Left column */}
            <div className="mw-left">
                <div className="mw-search">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const q = new FormData(e.currentTarget).get("q");
                            onSearch?.(String(q || ""));
                        }}
                    >
                        <input name="q" type="text" placeholder="Search..." />
                        <button aria-label="search" type="submit" />
                    </form>
                </div>

                <div className="mw-left-list">
                    <ul>
                        {quickList.map((it, idx) => (
                            <li key={idx}>
                                <i>{fmtTime(it.time)}</i>
                                {it.label}
                                <span>{Math.round(it.temp)}°</span>
                            </li>
                        ))}
                    </ul>

                    <ul className="mw-social">
                        <li><a href="#" aria-label="facebook">f</a></li>
                        <li><a href="#" aria-label="instagram">in</a></li>
                        <li><a href="#" aria-label="twitter">t</a></li>
                        <li><a href="#" aria-label="google">g+</a></li>
                    </ul>
                </div>
            </div>

            {/* Right column */}
            <div className="mw-right">
                {/* hero panel */}
                <div className="mw-hero" style={bgStyle}>
                    <div className="mw-hero-left">
                        <h2>{locationName}</h2>
                        <p className="mw-time">🕒 {nowLabel}</p>
                        <p className="mw-desc">{current.description}</p>
                    </div>

                    <div className="mw-hero-right">
                        <ul className="mw-days">
                            {daily.slice(0, 4).map((d) => (
                                <li key={d.time}>
                                    <div className="mw-day-icon" title={d.pictocode}>
                                        {iconFromPictocode(d.pictocode)}
                                    </div>
                                    <div className="mw-day-temp">{Math.round(d.temperature_max)}°</div>
                                    <span className="mw-day-meta">
                    {fmtWeekday(d.time)}
                                        <i>🕒 {fmtTime(d.time + "T11:00:00")}</i>
                  </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* bottom hourly scroller */}
                <div className="mw-hourly">
                    <div className="mw-hourly-track">
                        {(hourly.length ? hourly : daily.map((d) => ({
                            time: d.time + "T12:00:00",
                            temperature: (d.temperature_max + d.temperature_min) / 2,
                            pictocode: d.pictocode
                        }))).slice(0, 10).map((h, i) => (
                            <div className="mw-hour-card" key={i}>
                                <h4>{fmtShortHour(h.time)}</h4>
                                <h5>{Math.round(h.temperature)}°</h5>
                                <div className="mw-hour-icon">{iconFromPictocode(h.pictocode)}</div>
                            </div>
                        ))}
                    </div>

                    {/* footer metrics like yellow numbers */}
                    <div className="mw-metrics">
                        <div className="mw-metric">
                            <span className="mw-metric-value">{Math.round(current.temperature)}°</span>
                            <span className="mw-metric-label">Temp</span>
                        </div>
                        <div className="mw-metric">
              <span className="mw-metric-value">
                {current.windspeed ? `${Math.round(current.windspeed)} m/s ${degToCompass(current.winddirection)}` : "—"}
              </span>
                            <span className="mw-metric-label">Wind</span>
                        </div>
                        <div className="mw-metric">
                            <span className="mw-metric-value">{current.precipitation_probability ?? 0}%</span>
                            <span className="mw-metric-label">Precip</span>
                        </div>
                        <div className="mw-metric">
                            <span className="mw-metric-value">{current.relativehumidity ?? 0}%</span>
                            <span className="mw-metric-label">Humidity</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
