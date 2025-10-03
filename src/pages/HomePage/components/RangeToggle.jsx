export default function RangeToggle({ value, onChange }) {
    return (
        <div className="range-toggle">
            <button type="button" aria-pressed={value==="1h"} className={value==="1h" ? "active" : ""} onClick={() => onChange("1h")}>
                Hourly View
            </button>
            <button type="button" aria-pressed={value==="3h"} className={value==="3h" ? "active" : ""} onClick={() => onChange("3h")}>
                3 Hourly View
            </button>
        </div>
    );
}
