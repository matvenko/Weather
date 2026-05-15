// src/pages/HomePage/utils/weather-icons.js
import React from "react";
import {
    BsSunFill,
    BsCloudSunFill,
    BsCloudFill,
    BsCloudsFill,
    BsCloudFog2Fill,
    BsCloudDrizzleFill,
    BsCloudRainFill,
    BsCloudRainHeavyFill,
    BsCloudSnowFill,
    BsCloudSleetFill,
    BsCloudLightningFill,
    BsCloudLightningRainFill,
    BsMoonStarsFill,
    BsCloudMoonFill,
} from "react-icons/bs";

/**
 * Helper function to determine if a time is during night (20:00 - 06:00)
 * @param {string} timeStr - ISO time string
 * @returns {boolean} - true if night time
 */
export function isNightTime(timeStr) {
    if (!timeStr) return false;
    const date = new Date(timeStr);
    const hour = date.getHours();
    return hour >= 20 || hour < 6;
}

const el = (Comp) => React.createElement(Comp, {});

// Meteoblue pictocode → icon mapping
// https://docs.meteoblue.com/en/meteo/variables/pictograms
export function iconByCode(code, isNight = false) {
    const c = Number(code);

    if (isNight) {
        if (c === 1)  return el(BsMoonStarsFill);          // Clear night
        if (c === 2)  return el(BsCloudMoonFill);          // Few clouds
        if (c === 3)  return el(BsCloudMoonFill);          // Partly cloudy
        if (c === 4)  return el(BsCloudFill);              // Overcast
        if (c === 5)  return el(BsCloudFog2Fill);          // Fog
        if (c === 6)  return el(BsCloudRainFill);          // Overcast + rain
        if (c === 7)  return el(BsCloudDrizzleFill);       // Showers
        if (c === 8)  return el(BsCloudLightningRainFill); // Thunderstorms
        if (c === 9)  return el(BsCloudSnowFill);          // Overcast + snow
        if (c === 10) return el(BsCloudSnowFill);          // Snow showers
        if (c === 11) return el(BsCloudSleetFill);         // Sleet (rain + snow mix)
        if (c === 12) return el(BsCloudDrizzleFill);       // Overcast + light rain
        if (c === 13) return el(BsCloudSnowFill);          // Overcast + light snow
        if (c === 14) return el(BsCloudRainFill);          // Mostly cloudy + rain
        if (c === 15) return el(BsCloudSnowFill);          // Mostly cloudy + snow
        if (c === 16) return el(BsCloudDrizzleFill);       // Mostly cloudy + light rain
        if (c === 17) return el(BsCloudSnowFill);          // Mostly cloudy + light snow
        if (c === 20) return el(BsCloudsFill);             // Mostly cloudy
        if (c === 21) return el(BsCloudLightningFill);     // Clear + local thunder chance
        if (c === 22) return el(BsCloudLightningFill);     // Partly cloudy + local thunder chance
        if (c === 23) return el(BsCloudLightningRainFill); // Partly cloudy + thunder + showers
        if (c === 24) return el(BsCloudLightningRainFill); // Cloudy + thunder + heavy showers
        if (c === 25) return el(BsCloudLightningRainFill); // Mostly cloudy + thunder + showers
        // Hourly extended codes (26-35)
        if (c === 26) return el(BsCloudDrizzleFill);       // Light rain showers
        if (c === 27) return el(BsCloudRainHeavyFill);     // Heavy rain showers
        if (c === 28) return el(BsCloudSnowFill);          // Light snow showers
        if (c === 29) return el(BsCloudSnowFill);          // Heavy snow showers
        if (c === 30) return el(BsCloudSleetFill);         // Sleet
        if (c === 31) return el(BsCloudDrizzleFill);       // Light rain
        if (c === 32) return el(BsCloudRainHeavyFill);     // Heavy rain
        if (c === 33) return el(BsCloudSnowFill);          // Light snow
        if (c === 34) return el(BsCloudSnowFill);          // Heavy snow
        if (c === 35) return el(BsCloudSleetFill);         // Sleet / mixed
        return el(BsCloudMoonFill); // Default night
    }

    // Day icons (1-25) — Meteoblue daily pictocodes
    if (c === 1)  return el(BsSunFill);                // Clear sky
    if (c === 2)  return el(BsCloudSunFill);           // Few clouds
    if (c === 3)  return el(BsCloudSunFill);           // Partly cloudy
    if (c === 4)  return el(BsCloudFill);              // Overcast
    if (c === 5)  return el(BsCloudFog2Fill);          // Fog / mist
    if (c === 6)  return el(BsCloudRainFill);          // Overcast + rain
    if (c === 7)  return el(BsCloudDrizzleFill);       // Mixed + showers
    if (c === 8)  return el(BsCloudLightningRainFill); // Thunderstorms
    if (c === 9)  return el(BsCloudSnowFill);          // Overcast + snow
    if (c === 10) return el(BsCloudSnowFill);          // Mixed + snow showers
    if (c === 11) return el(BsCloudSleetFill);         // Sleet (rain + snow mix)
    if (c === 12) return el(BsCloudDrizzleFill);       // Overcast + light rain
    if (c === 13) return el(BsCloudSnowFill);          // Overcast + light snow
    if (c === 14) return el(BsCloudRainFill);          // Mostly cloudy + rain
    if (c === 15) return el(BsCloudSnowFill);          // Mostly cloudy + snow
    if (c === 16) return el(BsCloudDrizzleFill);       // Mostly cloudy + light rain
    if (c === 17) return el(BsCloudSnowFill);          // Mostly cloudy + light snow
    if (c === 20) return el(BsCloudsFill);             // Mostly cloudy
    if (c === 21) return el(BsCloudLightningFill);     // Clear + local thunder chance
    if (c === 22) return el(BsCloudLightningFill);     // Partly cloudy + local thunder chance
    if (c === 23) return el(BsCloudLightningRainFill); // Partly cloudy + thunder + showers
    if (c === 24) return el(BsCloudLightningRainFill); // Cloudy + thunder + heavy showers
    if (c === 25) return el(BsCloudLightningRainFill); // Mostly cloudy + thunder + showers

    // Hourly extended codes (26-35)
    if (c === 26) return el(BsCloudDrizzleFill);       // Light rain showers
    if (c === 27) return el(BsCloudRainHeavyFill);     // Heavy rain showers
    if (c === 28) return el(BsCloudSnowFill);          // Light snow showers
    if (c === 29) return el(BsCloudSnowFill);          // Heavy snow showers
    if (c === 30) return el(BsCloudSleetFill);         // Sleet
    if (c === 31) return el(BsCloudDrizzleFill);       // Light rain
    if (c === 32) return el(BsCloudRainHeavyFill);     // Heavy rain
    if (c === 33) return el(BsCloudSnowFill);          // Light snow
    if (c === 34) return el(BsCloudSnowFill);          // Heavy snow
    if (c === 35) return el(BsCloudSleetFill);         // Sleet / mixed

    return el(BsCloudFill); // Default
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
    11: { headline: "Sleet",              desc: "Mostly cloudy with a mixture of snow and rain" },
    12: { headline: "Light Rain",         desc: "Overcast with occasional light rain" },
    13: { headline: "Light Snow",         desc: "Overcast with occasional light snow" },
    14: { headline: "Rain",               desc: "Mostly cloudy with rain" },
    15: { headline: "Snow",               desc: "Mostly cloudy with snow" },
    16: { headline: "Light Rain",         desc: "Mostly cloudy with occasional light rain" },
    17: { headline: "Light Snow",         desc: "Mostly cloudy with occasional light snow" },
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
    1:  { headline: "ნათელი",                desc: "ნათელი, უღრუბლო ცა" },
    2:  { headline: "ცოტა ღრუბლიანი",       desc: "ნათელი და რამდენიმე ღრუბელი" },
    3:  { headline: "ნაწილობრივ ღრუბლიანი", desc: "ნაწილობრივ ღრუბლიანი" },
    4:  { headline: "მოღრუბლული",           desc: "მოღრუბლული" },
    5:  { headline: "ნისლი",                 desc: "ნისლი" },
    6:  { headline: "წვიმა",                 desc: "მოღრუბლული წვიმით" },
    7:  { headline: "ნაწვიმარი",             desc: "ცვალებადი ნაწვიმარით" },
    8:  { headline: "ჭექა-ქუხილი",           desc: "ნაწვიმარი, მოსალოდნელია ჭექა-ქუხილი" },
    9:  { headline: "თოვლი",                 desc: "მოღრუბლული თოვლით" },
    10: { headline: "თოვლის ნაწვიმარი",      desc: "ცვალებადი თოვლის ნაწვიმარით" },
    11: { headline: "ნახევრადნალექი",        desc: "ძირითადად მოღრუბლული თოვლისა და წვიმის ნარევით" },
    12: { headline: "მსუბუქი წვიმა",         desc: "მოღრუბლული პერიოდული მსუბუქი წვიმით" },
    13: { headline: "მსუბუქი თოვლი",         desc: "მოღრუბლული პერიოდული მსუბუქი თოვლით" },
    14: { headline: "წვიმა",                 desc: "ძირითადად მოღრუბლული წვიმით" },
    15: { headline: "თოვლი",                 desc: "ძირითადად მოღრუბლული თოვლით" },
    16: { headline: "მსუბუქი წვიმა",         desc: "ძირითადად მოღრუბლული პერიოდული მსუბუქი წვიმით" },
    17: { headline: "მსუბუქი თოვლი",         desc: "ძირითადად მოღრუბლული პერიოდული მსუბუქი თოვლით" },
    20: { headline: "ძირითადად მოღრუბლული",  desc: "ძირითადად მოღრუბლული" },
    21: { headline: "ჭექა-ქუხილი",           desc: "ძირითადად ნათელი ადგილობრივი ჭექა-ქუხილის შესაძლებლობით" },
    22: { headline: "ჭექა-ქუხილი",           desc: "ნაწილობრივ ღრუბლიანი ადგილობრივი ჭექა-ქუხილის შესაძლებლობით" },
    23: { headline: "ჭექა-ქუხილი",           desc: "ნაწილობრივ ღრუბლიანი ადგილობრივი ჭექა-ქუხილით და ნაწვიმარის შესაძლებლობით" },
    24: { headline: "ძლიერი შტორმი",         desc: "ღრუბლიანი ჭექა-ქუხილით და ძლიერი ნაწვიმარით" },
    25: { headline: "ჭექა-ქუხილი",           desc: "ძირითადად მოღრუბლული ჭექა-ქუხილით და ნაწვიმარით" },
    // საათობრივი პიქტოკოდები (26-35)
    26: { headline: "მსუბუქი ნაწვიმარი",     desc: "მსუბუქი წვიმის ნაწვიმარი" },
    27: { headline: "ძლიერი ნაწვიმარი",      desc: "ძლიერი წვიმის ნაწვიმარი" },
    28: { headline: "მსუბუქი თოვლის ნაწვიმარი", desc: "მსუბუქი თოვლის ნაწვიმარი" },
    29: { headline: "ძლიერი თოვლის ნაწვიმარი", desc: "ძლიერი თოვლის ნაწვიმარი" },
    30: { headline: "ნახევრადნალექი",        desc: "წვიმა-თოვლი ან შერეული ნალექი" },
    31: { headline: "მსუბუქი წვიმა",         desc: "მსუბუქი წვიმა" },
    32: { headline: "ძლიერი წვიმა",          desc: "ძლიერი წვიმა" },
    33: { headline: "მსუბუქი თოვლი",         desc: "მსუბუქი თოვლი" },
    34: { headline: "ძლიერი თოვლი",          desc: "ძლიერი თოვლი" },
    35: { headline: "ნახევრადნალექი",        desc: "წვიმა-თოვლი ან შერეული ნალექი" },
};

// Default export (ინგლისური)
export const WEATHER_TEXT_BY_CODE = WEATHER_TEXT_BY_CODE_EN;

// Snow/sleet → rain override when temperature is too warm for frozen precipitation.
// Meteoblue sometimes returns snow codes for marginal conditions; if the measured
// hourly temperature is clearly above freezing the precipitation will be liquid.
const SNOW_TO_RAIN = { 9: 6, 10: 7, 13: 12, 15: 14, 17: 16, 28: 26, 29: 27, 33: 31, 34: 32 };
const SLEET_TO_RAIN = { 11: 7, 30: 26, 35: 26 };

export function temperatureAdjustedPictocode(code, temperature) {
    const c = Number(code);
    const t = Number(temperature);
    if (!Number.isFinite(t)) return c;
    if (t > 4 && SLEET_TO_RAIN[c] != null) return SLEET_TO_RAIN[c];
    if (t > 2 && SNOW_TO_RAIN[c] != null) return SNOW_TO_RAIN[c];
    return c;
}

/**
 * Helper ფუნქცია რომელიც ენის მიხედვით დააბრუნებს ამინდის აღწერას
 * @param {number} pictocode - Weather pictocode (1-35)
 * @param {string} lang - Language code ('en' or 'ka')
 * @returns {object} - { headline, desc } ან default
 */
export function getWeatherText(pictocode, lang = 'en') {
    const codeMap = lang === 'ka' ? WEATHER_TEXT_BY_CODE_KA : WEATHER_TEXT_BY_CODE_EN;
    return codeMap[pictocode] || { headline: "Partly Cloudy", desc: "Partly Cloudy" };
}
