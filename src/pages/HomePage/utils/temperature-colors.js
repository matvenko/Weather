// Temperature-based color scheme (based on Celsius)
// Using 10-color scale for better granularity

/**
 * Returns a color based on temperature value
 * @param {number} temp - Temperature in Celsius
 * @returns {string} - CSS color value
 */
export function getTemperatureColor(temp) {
    if (!Number.isFinite(temp)) return "#FFFFFF"; // default white

    // 10-color scale based on temperature ranges
    if (temp >= 32) return "#8B0000";      // Dark red - 32°C and above
    if (temp >= 27) return "#DC143C";      // Red - 27-31°C
    if (temp >= 21) return "#FF8C00";      // Dark orange - 21-26°C
    if (temp >= 16) return "#FFA500";      // Orange - 16-20°C
    if (temp >= 10) return "#FFD700";      // Gold/Yellow - 10-15°C
    if (temp >= 5) return "#90EE90";       // Light green - 5-9°C
    if (temp >= -1) return "#00CED1";      // Turquoise - -1 to 4°C
    if (temp >= -7) return "#4169E1";      // Royal blue - -7 to -2°C
    if (temp >= -12) return "#1E3A8A";     // Dark blue - -12 to -8°C
    return "#191970";                       // Navy - -13°C and below
}

/**
 * Temperature color ranges for reference
 * Can be used for legends or documentation
 */
export const TEMPERATURE_RANGES = [
    { min: 32, max: Infinity, color: "#8B0000", label: "32°C+" },
    { min: 27, max: 31, color: "#DC143C", label: "27-31°C" },
    { min: 21, max: 26, color: "#FF8C00", label: "21-26°C" },
    { min: 16, max: 20, color: "#FFA500", label: "16-20°C" },
    { min: 10, max: 15, color: "#FFD700", label: "10-15°C" },
    { min: 5, max: 9, color: "#90EE90", label: "5-9°C" },
    { min: -1, max: 4, color: "#00CED1", label: "-1 to 4°C" },
    { min: -7, max: -2, color: "#4169E1", label: "-7 to -2°C" },
    { min: -12, max: -8, color: "#1E3A8A", label: "-12 to -8°C" },
    { min: -Infinity, max: -13, color: "#191970", label: "-13°C and below" }
];
