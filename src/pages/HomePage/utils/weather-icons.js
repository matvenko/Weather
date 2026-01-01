// src/pages/HomePage/utils/weather-icons.js
import React from "react";
import { IoIosThunderstorm } from "react-icons/io";

/**
 * Helper function to determine if a time is during night (20:00 - 06:00)
 * @param {string} timeStr - ISO time string
 * @returns {boolean} - true if night time
 */
export function isNightTime(timeStr) {
    if (!timeStr) return false;
    const date = new Date(timeStr);
    const hour = date.getHours();
    // Night is from 20:00 (8 PM) to 06:00 (6 AM)
    return hour >= 20 || hour < 6;
}

// JSX-ის ნაცვლად ვიყენებთ React.createElement-ს, რომ ბილდერს JSX ტრანსფორმი არ დასჭირდეს.
export function iconByCode(code, isNight = false) {
    const c = Number(code);

    // Night time icons
    if (isNight) {
        if (c === 1) return "🌙";           // Clear night - moon
        if (c === 2) return "🌙";           // Few clouds night
        if (c === 3) return React.createElement('span', {}, "☁️", React.createElement('span', { style: { marginLeft: '2px' } }, "🌙"));
        if (c === 4) return "☁️";           // Overcast (same)
        if (c === 5) return "🌫️";          // Fog (same)
        if (c === 6) return "🌧️";          // Rain (same)
        if (c === 7) return "🌦️";          // Showers (same)
        if (c === 8) return React.createElement(IoIosThunderstorm, {}); // Thunderstorms (same)
        if (c === 9) return "🌨️";          // Snow (same)
        if (c === 10) return "🌨️";         // Snow showers (same)
        if (c === 11) return React.createElement('span', {}, "🌧️", React.createElement('span', { style: { marginLeft: '2px' } }, "❄️"));
        if (c === 12) return "🌧️";         // Occasional rain (same)
        if (c === 13) return "🌨️";         // Occasional snow (same)
        if (c === 14) return "🌧️";         // Rain (same)
        if (c === 15) return "🌨️";         // Snow (same)
        if (c === 16) return "🌧️";         // Occasional rain (same)
        if (c === 17) return "🌨️";         // Occasional snow (same)
        if (c === 20) return "☁️";          // Mostly cloudy (same)
        if (c === 21 || c === 22 || c === 23 || c === 24 || c === 25) {
            return React.createElement(IoIosThunderstorm, {}); // Thunderstorms (same)
        }
        // Hourly pictocodes (26-35) for night
        if (c === 26) return "🌦️";         // Light rain showers
        if (c === 27) return "🌧️";         // Heavy rain showers
        if (c === 28) return "🌨️";         // Light snow showers
        if (c === 29) return "🌨️";         // Heavy snow showers
        if (c === 30) return React.createElement('span', {}, "🌧️", React.createElement('span', { style: { marginLeft: '2px' } }, "❄️")); // Sleet
        if (c === 31) return "🌧️";         // Light rain
        if (c === 32) return "🌧️";         // Heavy rain
        if (c === 33) return "🌨️";         // Light snow
        if (c === 34) return "🌨️";         // Heavy snow
        if (c === 35) return React.createElement('span', {}, "🌧️", React.createElement('span', { style: { marginLeft: '2px' } }, "❄️")); // Sleet/mixed
        return "☁️"; // Default night
    }

    // Daily pictocodes (1-25)
    if (c === 1) return "☀️";           // Clear
    if (c === 2) return "🌤️";          // Few clouds
    if (c === 3) return "⛅";           // Partly cloudy
    if (c === 4) return "☁️";           // Overcast
    if (c === 5) return "🌫️";          // Fog
    if (c === 6) return "🌧️";          // Rain
    if (c === 7) return "🌦️";          // Showers
    if (c === 8) return React.createElement(IoIosThunderstorm, {}); // Thunderstorms
    if (c === 9) return "🌨️";          // Snow
    if (c === 10) return "🌨️";         // Snow showers
    if (c === 11) return React.createElement('span', {}, "🌧️", React.createElement('span', { style: { marginLeft: '2px' } }, "❄️"));
    if (c === 12) return "🌧️";         // Occasional rain
    if (c === 13) return "🌨️";         // Occasional snow
    if (c === 14) return "🌧️";         // Rain
    if (c === 15) return "🌨️";         // Snow
    if (c === 16) return "🌧️";         // Occasional rain
    if (c === 17) return "🌨️";         // Occasional snow
    if (c === 20) return "☁️";          // Mostly cloudy
    if (c === 21 || c === 22 || c === 23 || c === 24 || c === 25) {
        return React.createElement(IoIosThunderstorm, {}); // Thunderstorms
    }

    // Hourly pictocodes (26-35) - additional codes for hourly data
    if (c === 26) return "🌦️";         // Light rain showers
    if (c === 27) return "🌧️";         // Heavy rain showers
    if (c === 28) return "🌨️";         // Light snow showers
    if (c === 29) return "🌨️";         // Heavy snow showers
    if (c === 30) return React.createElement('span', {}, "🌧️", React.createElement('span', { style: { marginLeft: '2px' } }, "❄️")); // Sleet
    if (c === 31) return "🌧️";         // Light rain
    if (c === 32) return "🌧️";         // Heavy rain
    if (c === 33) return "🌨️";         // Light snow
    if (c === 34) return "🌨️";         // Heavy snow
    if (c === 35) return React.createElement('span', {}, "🌧️", React.createElement('span', { style: { marginLeft: '2px' } }, "❄️")); // Sleet/mixed

    return "☁️"; // Default
}

// ტექსტური აღწერები pictocode-ით (Meteoblue Daily Codes 1-25)
// https://docs.meteoblue.com/en/meteo/variables/pictograms
export const WEATHER_TEXT_BY_CODE_EN = {
    1:  { headline: "Clear",              desc: "Clear, cloudless sky" },
    2:  { headline: "Few Clouds",         desc: "Clear and few clouds" },
    3:  { headline: "Partly Cloudy",      desc: "Partly cloudy" },
    4:  { headline: "Overcast",           desc: "Overcast" },
    5:  { headline: "Fog",                desc: "Fog" },
    6:  { headline: "Rain",               desc: "Overcast with rain" },
    7:  { headline: "Showers",            desc: "Mixed with showers" },
    8:  { headline: "Thunderstorms",      desc: "Showers, thunderstorms likely" },
    9:  { headline: "Snow",               desc: "Overcast with snow" },
    10: { headline: "Snow Showers",       desc: "Mixed with snow showers" },
    11: { headline: "Mixed",              desc: "Mostly cloudy with a mixture of snow and rain" },
    12: { headline: "Rain",               desc: "Overcast with occasional rain" },
    13: { headline: "Snow",               desc: "Overcast with occasional snow" },
    14: { headline: "Rain",               desc: "Mostly cloudy with rain" },
    15: { headline: "Snow",               desc: "Mostly cloudy with snow" },
    16: { headline: "Rain",               desc: "Mostly cloudy with occasional rain" },
    17: { headline: "Snow",               desc: "Mostly cloudy with occasional snow" },
    20: { headline: "Mostly Cloudy",      desc: "Mostly cloudy" },
    21: { headline: "Thunderstorms",      desc: "Mostly clear with a chance of local thunderstorms" },
    22: { headline: "Thunderstorms",      desc: "Partly cloudy with a chance of local thunderstorms" },
    23: { headline: "Thunderstorms",      desc: "Partly cloudy with local thunderstorms and showers possible" },
    24: { headline: "Heavy Storm",        desc: "Cloudy with thunderstorms and heavy showers" },
    25: { headline: "Thunderstorms",      desc: "Mostly cloudy with thunderstorms and showers" },
    // Hourly pictocodes (26-35)
    26: { headline: "Light Showers",      desc: "Light rain showers" },
    27: { headline: "Heavy Showers",      desc: "Heavy rain showers" },
    28: { headline: "Light Snow Showers", desc: "Light snow showers" },
    29: { headline: "Heavy Snow Showers", desc: "Heavy snow showers" },
    30: { headline: "Sleet",              desc: "Sleet or mixed precipitation" },
    31: { headline: "Light Rain",         desc: "Light rain" },
    32: { headline: "Heavy Rain",         desc: "Heavy rain" },
    33: { headline: "Light Snow",         desc: "Light snow" },
    34: { headline: "Heavy Snow",         desc: "Heavy snow" },
    35: { headline: "Sleet",              desc: "Sleet or mixed precipitation" },
};

export const WEATHER_TEXT_BY_CODE_KA = {
    1:  { headline: "ნათელი",             desc: "ნათელი, უღრუბლო ცა" },
    2:  { headline: "ცოტა ღრუბლიანი",    desc: "ნათელი და რამდენიმე ღრუბელი" },
    3:  { headline: "ნაწილობრივ ღრუბლიანი", desc: "ნაწილობრივ ღრუბლიანი" },
    4:  { headline: "მოღრუბლული",        desc: "მოღრუბლული" },
    5:  { headline: "ნისლი",              desc: "ნისლი" },
    6:  { headline: "წვიმა",              desc: "მოღრუბლული წვიმით" },
    7:  { headline: "ჰაერი",              desc: "ცვალებადი ჰაერით" },
    8:  { headline: "ჭექა-ქუხილი",        desc: "ჰაერი, მოსალოდნელია ჭექა-ქუხილი" },
    9:  { headline: "თოვლი",              desc: "მოღრუბლული თოვლით" },
    10: { headline: "თოვლის ჰაერი",       desc: "ცვალებადი თოვლის ჰაერით" },
    11: { headline: "შერეული",            desc: "ძირითადად მოღრუბლული თოვლისა და წვიმის ნარევით" },
    12: { headline: "წვიმა",              desc: "მოღრუბლული პერიოდული წვიმით" },
    13: { headline: "თოვლი",              desc: "მოღრუბლული პერიოდული თოვლით" },
    14: { headline: "წვიმა",              desc: "ძირითადად მოღრუბლული წვიმით" },
    15: { headline: "თოვლი",              desc: "ძირითადად მოღრუბლული თოვლით" },
    16: { headline: "წვიმა",              desc: "ძირითადად მოღრუბლული პერიოდული წვიმით" },
    17: { headline: "თოვლი",              desc: "ძირითადად მოღრუბლული პერიოდული თოვლით" },
    20: { headline: "ძირითადად მოღრუბლული", desc: "ძირითადად მოღრუბლული" },
    21: { headline: "ჭექა-ქუხილი",        desc: "ძირითადად ნათელი ადგილობრივი ჭექა-ქუხილის შესაძლებლობით" },
    22: { headline: "ჭექა-ქუხილი",        desc: "ნაწილობრივ ღრუბლიანი ადგილობრივი ჭექა-ქუხილის შესაძლებლობით" },
    23: { headline: "ჭექა-ქუხილი",        desc: "ნაწილობრივ ღრუბლიანი ადგილობრივი ჭექა-ქუხილით და ჰაერის შესაძლებლობით" },
    24: { headline: "ძლიერი შტორმი",      desc: "ღრუბლიანი ჭექა-ქუხილით და ძლიერი ჰაერით" },
    25: { headline: "ჭექა-ქუხილი",        desc: "ძირითადად მოღრუბლული ჭექა-ქუხილით და ჰაერით" },
    // საათობრივი პიქტოკოდები (26-35)
    26: { headline: "მსუბუქი ჰაერი",      desc: "მსუბუქი წვიმის ჰაერი" },
    27: { headline: "ძლიერი ჰაერი",       desc: "ძლიერი წვიმის ჰაერი" },
    28: { headline: "მსუბუქი თოვლის ჰაერი", desc: "მსუბუქი თოვლის ჰაერი" },
    29: { headline: "ძლიერი თოვლის ჰაერი", desc: "ძლიერი თოვლის ჰაერი" },
    30: { headline: "შერეული",           desc: "წვიმა-თოვლი ან შერეული ნალექი" },
    31: { headline: "მსუბუქი წვიმა",      desc: "მსუბუქი წვიმა" },
    32: { headline: "ძლიერი წვიმა",       desc: "ძლიერი წვიმა" },
    33: { headline: "მსუბუქი თოვლი",      desc: "მსუბუქი თოვლი" },
    34: { headline: "ძლიერი თოვლი",       desc: "ძლიერი თოვლი" },
    35: { headline: "შერეული",           desc: "წვიმა-თოვლი ან შერეული ნალექი" },
};

// Default export (ინგლისური)
export const WEATHER_TEXT_BY_CODE = WEATHER_TEXT_BY_CODE_EN;

/**
 * Helper ფუნქცია რომელიც ენის მიხედვით დააბრუნებს ამინდის აღწერას
 * @param {number} pictocode - Weather pictocode (1-25)
 * @param {string} lang - Language code ('en' or 'ka')
 * @returns {object} - { headline, desc } ან default
 */
export function getWeatherText(pictocode, lang = 'en') {
    const codeMap = lang === 'ka' ? WEATHER_TEXT_BY_CODE_KA : WEATHER_TEXT_BY_CODE_EN;
    return codeMap[pictocode] || { headline: "Partly Cloudy", desc: "Partly Cloudy" };
}
