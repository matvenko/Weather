import React from "react";

/** props.hours: [{time:'03:00', temp:21, icon:'', rainProb:30}] */
export default function DayDetails({ title, hours = [] }) {
    return (
        <div className="wx-day">
            <h3 className="wx-day-title">{title}</h3>

            {/* ზოლიანი „ტემპერატურის ბარი“ (სქელი ლენტი) */}
            <div className="wx-band">
                {hours.map((h) => (
                    <div key={h.time} className="wx-band-col" title={`${h.time} • ${h.temp}°`}>
                        <div className="wx-band-color" style={{ opacity: Math.min(1, (h.temp || 0) / 35) }} />
                        <div className="wx-band-time">{h.time}</div>
                    </div>
                ))}
            </div>

            {/* პატარა მეტრიკები (საბაზო ვერსია) */}
            <div className="wx-table">
                <div className="wx-row wx-head">
                    <div>Temp (°C)</div><div>Feels (°C)</div><div>Wind (km/h)</div><div>Precip (mm)</div><div>Prob (%)</div>
                </div>
                {hours.map((h) => (
                    <div key={h.time} className="wx-row">
                        <div>{h.temp ?? "-"}</div>
                        <div>{h.feels ?? "-"}</div>
                        <div>{h.wind ?? "-"}</div>
                        <div>{h.rain ?? "-"}</div>
                        <div>{h.rainProb ?? "-"}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
