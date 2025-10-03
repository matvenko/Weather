// src/pages/HomePage/utils/weather-icons.js
import React from "react";
import { IoIosThunderstorm } from "react-icons/io";

// ყოველთვის დააბრუნე render-თვის ვალიდური მნიშვნელობა (string ან React ელემენტი)
// JSX-ის ნაცვლად ვიყენებთ React.createElement-ს, რომ ბილდერს JSX ტრანსფორმი არ დასჭირდეს.
export function iconByCode(code) {
    switch (Number(code)) {
        case 1:  return "☀️";
        case 2:  return "🌤️";
        case 3:  return "⛅";
        case 4:  return "☁️";
        case 7:  return "🌦️";
        case 16: return "🌧️";
        case 22: return React.createElement(IoIosThunderstorm, {}); // <IoIosThunderstorm />
        default: return "☁";
    }
}

// სურვილისამებრ: ტექსტური აღწერები pictocode-ით
export const WEATHER_TEXT_BY_CODE = {
    1:  { headline: "Sunny",            desc: "Clear skies" },
    2:  { headline: "Mostly Sunny",     desc: "Sunny with few clouds" },
    3:  { headline: "Partly Cloudy",    desc: "Intervals of cloud" },
    4:  { headline: "Cloudy",           desc: "Overcast conditions" },
    7:  { headline: "Showers",          desc: "Sun with passing showers" },
    16: { headline: "Rain",             desc: "Showers likely" },
    22: { headline: "Thunderstorm",     desc: "Thunder and rain" },
};
