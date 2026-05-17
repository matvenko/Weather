import { Spin } from "antd";
import { FiThermometer, FiDroplet, FiClock, FiCheck, FiX, FiTrendingUp, FiTrendingDown, FiMinus } from "react-icons/fi";
import { useAirQuality } from "./hooks/useAirQuality";
import "@src/pages/HomePage/css/Forecast.css";
import "./AirPollution.css";

const AQI_SCALE = [
    { label: "კარგი",      range: "0–50",    color: "#00c46a", max: 50  },
    { label: "ზომიერი",    range: "51–100",  color: "#f0c040", max: 100 },
    { label: "მგრძნობ.",   range: "101–150", color: "#ff7e00", max: 150 },
    { label: "საშიში",     range: "151–200", color: "#e53935", max: 200 },
    { label: "ძ. საშიში",  range: "201–300", color: "#8f3f97", max: 300 },
    { label: "კრიტიკული", range: "301+",    color: "#7e0023", max: 999 },
];

const AQI_LABELS_KA = {
    "Good":                             "კარგი",
    "Moderate":                         "ზომიერი",
    "Unhealthy for Sensitive Groups":   "მგრძნობიარე ჯგუფებისთვის",
    "Unhealthy":                        "არასაჯანსაღო",
    "Very Unhealthy":                   "ძალიან საშიში",
    "Hazardous":                        "კრიტიკული",
};

const HEALTH_RECS = {
    "Good": {
        summary: "ჰაერი სუფთაა. გარეთ ყოფნა ყველასათვის უსაფრთხოა.",
        items: [
            { ok: true,  text: "გარეთ ვარჯიში" },
            { ok: true,  text: "ფანჯრების გახსნა" },
            { ok: true,  text: "ბავშვების გარეთ თამაში" },
            { ok: true,  text: "პირბადე — საჭირო არ არის" },
        ],
    },
    "Moderate": {
        summary: "ჰაერი მისაღებია. მგრძნობიარე ადამიანებმა სიფრთხილე გამოიჩინონ.",
        items: [
            { ok: true,  text: "ჩვეულებრივი ვარჯიში" },
            { ok: false, text: "ინტენსიური ვარჯიში (ასთმა/გული)" },
            { ok: true,  text: "ბავშვების გარეთ თამაში" },
            { ok: false, text: "ფანჯრების გახსნა — ყოყმანით" },
        ],
    },
    "Unhealthy for Sensitive Groups": {
        summary: "მგრძნობიარე ჯგუფებმა (ასთმა, გულ-სისხლძარღვ.) გარეთ ყოფნა შეზღუდონ.",
        items: [
            { ok: false, text: "ინტენსიური გარეთ ვარჯიში" },
            { ok: false, text: "ბავშვების ხანგრძლივი გარეთ თამაში" },
            { ok: true,  text: "შიდა ვარჯიში" },
            { ok: false, text: "ფანჯრების გახსნა" },
        ],
    },
    "Unhealthy": {
        summary: "ყველა ადამიანზე შეიძლება იყოს უარყოფითი ეფექტი. გარეთ ყოფნა შეზღუდეთ.",
        items: [
            { ok: false, text: "გარეთ ვარჯიში" },
            { ok: false, text: "ბავშვების გარეთ თამაში" },
            { ok: true,  text: "შიდა ვარჯიში" },
            { ok: false, text: "ფანჯრების გახსნა" },
        ],
    },
    "Very Unhealthy": {
        summary: "გადაუდებელი ჯანმრთელობის გაფრთხილება. გარეთ ნუ გახვალთ.",
        items: [
            { ok: false, text: "გარეთ გასვლა" },
            { ok: false, text: "ნებისმიერი გარეთ ვარჯიში" },
            { ok: true,  text: "სახლის დახურვა" },
            { ok: true,  text: "პირბადე — სავალდებულო" },
        ],
    },
    "Hazardous": {
        summary: "კრიტიკული. ყველა ადამიანი სახლში დარჩეს.",
        items: [
            { ok: false, text: "გარეთ გასვლა" },
            { ok: false, text: "ფანჯრები და კარები" },
            { ok: true,  text: "სახლის ჰაერმჭიდრო დახურვა" },
            { ok: true,  text: "ჰაერის გამწმენდი — გამოიყენეთ" },
        ],
    },
};

function getAqiColor(aqi) {
    return AQI_SCALE.find(s => aqi <= s.max)?.color ?? "#7e0023";
}

function getActiveIdx(aqi) {
    return AQI_SCALE.findIndex(s => aqi <= s.max);
}

function fToC(f) {
    return (((f - 32) * 5) / 9).toFixed(1);
}

function inHgToHpa(v) {
    return Math.round(v * 33.8639);
}

function relativeTime(ts) {
    const diff = Math.floor(Date.now() / 1000 - ts);
    if (diff < 60) return "ახლახანს";
    if (diff < 3600) return `${Math.round(diff / 60)} წთ წინ`;
    return `${Math.round(diff / 3600)} სთ წინ`;
}

function barTrendInfo(trend) {
    if (trend > 0.05)  return { icon: <FiTrendingUp size={11} />,  label: "იზრდება",    color: "#f0c040" };
    if (trend < -0.05) return { icon: <FiTrendingDown size={11} />, label: "მცირდება",   color: "#e53935" };
    return               { icon: <FiMinus size={11} />,       label: "სტაბილური", color: "var(--muted)" };
}

function MetricCard({ label, value, unit, sub }) {
    return (
        <div className="ap-metric-card glass-soft">
            <div className="ap-metric-label">{label}</div>
            <div className="ap-metric-value">
                {value}
                {unit && <span className="ap-metric-unit">{unit}</span>}
            </div>
            {sub && <div className="ap-metric-sub">{sub}</div>}
        </div>
    );
}

export default function AirPollutionPage() {
    const { isLoading, isError, aqiData, barData } = useAirQuality();

    if (isLoading) {
        return (
            <div className="ap-page" style={{ display: "grid", placeItems: "center", minHeight: "40vh" }}>
                <Spin size="large" />
            </div>
        );
    }

    if (isError || !aqiData) {
        return (
            <div className="ap-page">
                <p style={{ color: "var(--muted)" }}>მონაცემების ჩატვირთვა ვერ მოხერხდა.</p>
            </div>
        );
    }

    const color      = getAqiColor(aqiData.aqi_val);
    const activeIdx  = getActiveIdx(aqiData.aqi_val);
    const healthRec  = HEALTH_RECS[aqiData.aqi_desc] ?? HEALTH_RECS["Good"];
    const barTrend   = barData ? barTrendInfo(barData.bar_trend) : null;

    return (
        <div className="ap-page">
            <div className="ap-content">

                {/* ── Hero ── */}
                <div className="ap-hero glass-soft">
                    <div className="ap-aqi-circle" style={{ background: color, boxShadow: `0 0 44px ${color}50` }}>
                        <span className="ap-aqi-value">{Math.round(aqiData.aqi_val)}</span>
                        <span className="ap-aqi-label-badge">AQI</span>
                    </div>
                    <div>
                        <div className="ap-aqi-desc" style={{ color }}>
                            {AQI_LABELS_KA[aqiData.aqi_desc] ?? aqiData.aqi_desc}
                        </div>
                        <div className="ap-aqi-type">{aqiData.aqi_type}</div>
                        {aqiData.last_report_time && (
                            <div className="ap-last-update">
                                <FiClock size={12} />
                                {relativeTime(aqiData.last_report_time)}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── AQI Scale ── */}
                <div className="ap-scale-card glass-soft">
                    <div className="ap-card-title">AQI სკალა</div>
                    <div className="ap-scale-bar">
                        {AQI_SCALE.map((seg, i) => (
                            <div
                                key={seg.label}
                                className={`ap-scale-segment${i === activeIdx ? " active" : ""}`}
                                style={{ background: seg.color, opacity: i === activeIdx ? 1 : 0.3 }}
                            />
                        ))}
                    </div>
                    <div className="ap-scale-labels">
                        {AQI_SCALE.map((seg, i) => (
                            <div key={seg.label} className={`ap-scale-seg-label${i === activeIdx ? " active" : ""}`}>
                                <div>{seg.label}</div>
                                <div style={{ opacity: 0.55, fontSize: 9 }}>{seg.range}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Health + Outdoor ── */}
                <div className="ap-mid-grid">
                    <div className="ap-health-card glass-soft">
                        <div className="ap-card-title">ჯანმრთელობის რჩევები</div>
                        <div className="ap-health-summary">{healthRec.summary}</div>
                        <div className="ap-health-items">
                            {healthRec.items.map((item, i) => (
                                <div key={i} className="ap-health-item">
                                    <div className={`ap-health-icon ${item.ok ? "ok" : "no"}`}>
                                        {item.ok ? <FiCheck size={11} /> : <FiX size={11} />}
                                    </div>
                                    {item.text}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="ap-outdoor-card glass-soft">
                        <div className="ap-card-title">გარე პირობები</div>
                        <div className="ap-outdoor-grid">
                            <div className="ap-outdoor-item">
                                <div className="ap-outdoor-icon-label"><FiThermometer size={11} /> ტემპერატურა</div>
                                <div className="ap-outdoor-val">{fToC(aqiData.temp)}°C</div>
                                <div className="ap-outdoor-sub">სიცხის ინდ.: {fToC(aqiData.heat_index)}°C</div>
                            </div>
                            <div className="ap-outdoor-item">
                                <div className="ap-outdoor-icon-label"><FiDroplet size={11} /> ტენიანობა</div>
                                <div className="ap-outdoor-val">{Math.round(aqiData.hum)}%</div>
                                <div className="ap-outdoor-sub">ნამის წ.: {fToC(aqiData.dew_point)}°C</div>
                            </div>
                            {barData && (
                                <div className="ap-outdoor-item">
                                    <div className="ap-outdoor-icon-label">ატმ. წნევა</div>
                                    <div className="ap-outdoor-val">{inHgToHpa(barData.bar_sea_level)}</div>
                                    <div className="ap-outdoor-sub" style={{ color: barTrend.color }}>
                                        {barTrend.icon} {barTrend.label} · hPa
                                    </div>
                                </div>
                            )}
                            <div className="ap-outdoor-item">
                                <div className="ap-outdoor-icon-label">PM1</div>
                                <div className="ap-outdoor-val">{aqiData.pm_1.toFixed(2)}</div>
                                <div className="ap-outdoor-sub">μg/m³</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── PM Particles ── */}
                <div className="ap-section-label">ნაწილაკური დაბინძურება</div>
                <div className="ap-metrics">
                    <MetricCard
                        label="PM2.5"
                        value={aqiData.pm_2p5.toFixed(2)}
                        unit="μg/m³"
                        sub={`1სთ: ${aqiData.pm_2p5_1_hour.toFixed(2)} · 3სთ: ${aqiData.pm_2p5_3_hour.toFixed(2)}`}
                    />
                    <MetricCard
                        label="PM10"
                        value={aqiData.pm_10.toFixed(2)}
                        unit="μg/m³"
                        sub={`1სთ: ${aqiData.pm_10_1_hour.toFixed(2)} · 3სთ: ${aqiData.pm_10_3_hour.toFixed(2)}`}
                    />
                    <MetricCard
                        label="PM2.5 (24 სთ)"
                        value={aqiData.pm_2p5_24_hour.toFixed(2)}
                        unit="μg/m³"
                        sub={`NowCast: ${aqiData.pm_2p5_nowcast.toFixed(2)}`}
                    />
                    <MetricCard
                        label="PM10 (24 სთ)"
                        value={aqiData.pm_10_24_hour.toFixed(2)}
                        unit="μg/m³"
                        sub={`NowCast: ${aqiData.pm_10_nowcast.toFixed(2)}`}
                    />
                </div>
            </div>
        </div>
    );
}
