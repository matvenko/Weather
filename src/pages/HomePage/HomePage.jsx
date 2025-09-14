import React, { useMemo, useState } from "react";
import ForecastStrip from "../../components/weather/ForecastStrip";
import DayDetails from "../../components/weather/DayDetails";
import "./css/Homepage.css"

export default function HomePage() {
    const days = useMemo(() => ([
        { date: "Tue", label: "Tue", max: 29, min: 20, wind: "18 km/h", precip: "0–5 mm", sunHours: 5, selected: true },
        { date: "Wed", label: "Wed", max: 23, min: 19, wind: "32 km/h", precip: "0–2 mm", sunHours: 7 },
        { date: "Thu", label: "Thu", max: 21, min: 18, wind: "25 km/h", precip: "10–20 mm", sunHours: 2 },
        { date: "Fri", label: "Fri", max: 24, min: 19, wind: "22 km/h", precip: "0–2 mm", sunHours: 9 },
        { date: "Sat", label: "Sat", max: 20, min: 18, wind: "20 km/h", precip: "≥5 mm",  sunHours: 0 },
        { date: "Sun", label: "Sun", max: 19, min: 17, wind: "23 km/h", precip: "—",     sunHours: 6 },
        { date: "Mon", label: "Mon", max: 18, min: 16, wind: "17 km/h", precip: "—",     sunHours: 2 },
    ]), []);

    const [active, setActive] = useState(days[0]);

    const hours = useMemo(() => ([
        { time: "03:00", temp: 21, feels: 21, wind: "15–22", rain: "< 1", rainProb: 30 },
        { time: "06:00", temp: 21, feels: 21, wind: "12–22", rain: "1",   rainProb: 30 },
        { time: "09:00", temp: 22, feels: 22, wind: "17–27", rain: "< 1", rainProb: 30 },
        { time: "12:00", temp: 25, feels: 25, wind: "16–28", rain: "—",   rainProb: 25 },
        { time: "15:00", temp: 28, feels: 28, wind: "16–28", rain: "—",   rainProb: 0  },
        { time: "18:00", temp: 26, feels: 26, wind: "14–24", rain: "—",   rainProb: 10 },
        { time: "21:00", temp: 22, feels: 22, wind: "18–31", rain: "—",   rainProb: 20 },
    ]), []);

    return (
        <>
            {/*<h1 style={{ marginBottom: 12 }}>Weather Tbilisi</h1>*/}
            {/*<ForecastStrip*/}
            {/*    days={days.map(d => ({ ...d, selected: d.label === active.label }))}*/}
            {/*    onSelect={(d) => setActive(d)}*/}
            {/*/>*/}
            {/*<DayDetails title={active?.label || "Today"} hours={hours} />*/}
        </>
    );
}
