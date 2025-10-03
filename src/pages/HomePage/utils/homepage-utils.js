// src/pages/HomePage/homepage-utils.js
import { useMemo } from "react";

/* ---------- core date helpers ---------- */
export const toDate = (s) => new Date(String(s).replace(" ", "T"));
export const fmtDayLong = (d) =>
    toDate(d).toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });

/* ---------- data shaping ---------- */
export function buildPseudoHourlyForDay(d, points = 8) {
    const arr = [];
    for (let i = 0; i < points; i++) {
        const hour = 9 + i;
        arr.push({
            time: `${d.time} ${String(hour).padStart(2, "0")}:00`,
            temperature: (Number(d.temperature_min) + Number(d.temperature_max)) / 2,
            pictocode: d.pictocode,
            winddirection: d.winddirection,
            windspeed: (Number(d.windspeed_min) + Number(d.windspeed_max)) / 2,
            precipitation: d.precipitation,
            precipitation_probability: d.precipitation_probability,
        });
    }
    return arr;
}

export function groupHourlyByDate(hourly = []) {
    const map = new Map();
    for (const h of hourly) {
        const [dateStr] = String(h.time).split(" ");
        if (!map.has(dateStr)) map.set(dateStr, []);
        map.get(dateStr).push(h);
    }
    map.forEach((list) => list.sort((a, b) => toDate(a.time) - toDate(b.time)));
    return map;
}

/* ---------- formatting ---------- */
export const degToCompass = (deg) => {
    if (deg == null || isNaN(deg)) return "—";
    const dirs = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
    return dirs[Math.round(deg / 22.5) % 16];
};

export const msToKmh = (ms) => {
    const v = Number(ms);
    if (!Number.isFinite(v)) return "—";
    return Math.round(v * 3.6);
};

export const fmtHour = (d) => {
    const date = toDate(d);
    let h = date.getHours();
    const m = date.getMinutes();
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    const mm = String(m).padStart(2, "0");
    return `${String(h).padStart(2, "0")}:${mm} ${ampm}`;
};

export const fmtPrecipMm = (mm) => {
    if (mm == null) return "—";
    const v = Number(mm);
    if (!Number.isFinite(v)) return "—";
    if (v > 0 && v < 1) return "< 1";
    return String(Math.round(v));
};

/* ---------- sparkline ---------- */
export function useSparkline(values, { w = 680, h = 110, pad = 10 } = {}) {
    return useMemo(() => {
        const nums = (values || []).map(Number).filter(Number.isFinite);
        if (nums.length === 0) return { d: "" };

        const min = Math.min(...nums);
        const max = Math.max(...nums);
        const span = max - min || 1;
        const stepX = (w - pad * 2) / (nums.length - 1 || 1);
        const yScale = (v) => h - pad - ((v - min) / span) * (h - pad * 2);
        const pts = nums.map((v, i) => [pad + i * stepX, yScale(v)]);

        // ერთ წერტილზე სწორი სისწორე
        if (pts.length === 1) {
            const [[x, y]] = pts;
            return { d: `M ${x} ${y} L ${w - pad} ${y}` };
        }

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
