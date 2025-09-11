import React from "react";

/** props.days: [{date,label,icon,max,min,wind,precip,sunHours,selected}]
 *  label: 'Tue', 'Wed'...
 */
export default function ForecastStrip({ days = [], onSelect }) {
    return (
        <div className="wx-strip">
            {days.map((d) => (
                <div
                    key={d.date}
                    className={`wx-strip-item ${d.selected ? "is-active" : ""}`}
                    onClick={() => onSelect?.(d)}
                >
                    <div className="wx-strip-head">
                        <div className="wx-strip-day">{d.label}</div>
                        <div className="wx-strip-date">{d.date}</div>
                    </div>
                    <div className="wx-strip-icon">
                        {d.icon ? <img src={d.icon} alt="" /> : <span>☁️</span>}
                    </div>
                    <div className="wx-strip-temps">
                        <span className="tmax">{d.max}°C</span>
                        <span className="tmin">{d.min}°C</span>
                    </div>
                    <div className="wx-strip-meta">
                        <span>💨 {d.wind}</span>
                        <span>💧 {d.precip}</span>
                        <span>☀️ {d.sunHours}h</span>
                    </div>
                </div>
            ))}
        </div>
    );
}
