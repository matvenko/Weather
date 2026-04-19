// Maps pictocode + isNight + locationType → video filename
// Available videos in VideoBanner/Mp4/:
//   sunny.mp4, cloudy.mp4, day-light-cloudy.mp4, morning-cloudy.mp4,
//   rainy.mp4, hard-rain.mp4, nightStorm.mp4,
//   snow.mp4, night-snow.mp4, village-snow.mp4, mountains-snow.mp4,
//   sea-sunset.mp4, vazi.mp4, main.mp4

export function videoByWeather(pictocode, isNight, locationType = "city") {
    const c = Number(pictocode);
    const isMountain = locationType === "mountain";
    const isSea = locationType === "sea";

    // Snow
    if ([9, 10, 13, 15, 17, 28, 29, 33, 34].includes(c)) {
        if (isMountain) return "mountains-snow.mp4";
        return isNight ? "night-snow.mp4" : "snow.mp4";
    }

    // Mixed rain+snow / sleet
    if ([11, 30, 35].includes(c)) {
        if (isMountain) return "village-snow.mp4";
        return isNight ? "night-snow.mp4" : "snow.mp4";
    }

    // Thunderstorm
    if ([8, 21, 22, 23, 24, 25].includes(c)) {
        return "nightStorm.mp4";
    }

    // Heavy rain
    if ([27, 32].includes(c)) {
        return "hard-rain.mp4";
    }

    // Rain / showers
    if ([6, 7, 12, 14, 16, 26, 31].includes(c)) {
        return "rainy.mp4";
    }

    // Fog
    if (c === 5) return "morning-cloudy.mp4";

    // Overcast / mostly cloudy
    if (c === 4 || c === 20) return "cloudy.mp4";

    // Partly cloudy
    if (c === 3) {
        if (isSea) return "sea-sunset.mp4";
        return isNight ? "cloudy.mp4" : "day-light-cloudy.mp4";
    }

    // Clear / few clouds (1, 2)
    if (c === 1 || c === 2) {
        if (isSea) return "sea-sunset.mp4";
        if (isMountain) return isNight ? "night-snow.mp4" : "vazi.mp4";
        return isNight ? "main.mp4" : "sunny.mp4";
    }

    return "main.mp4";
}
