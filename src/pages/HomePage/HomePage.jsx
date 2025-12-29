import React, {useState} from "react";
import "./css/Homepage.css";
import {useTranslation} from "react-i18next";
import {useWeatherDaily} from "@src/pages/HomePage/hooks/useWeatherDaily.js";
import {Skeleton, Alert} from "antd";
import {useWeatherHourly} from "@src/pages/HomePage/hooks/useWeatherHourly.js";
import Forecast from "@src/pages/HomePage/components/Forecast.jsx";

export default function HomePage() {
    const {t} = useTranslation();
    const [selectedLocation, setSelectedLocation] = useState({name: "Tbilisi, Georgia", lat: 41.6914, lon: 44.8341})


    const {
        isLoadingDailyForecast,
        isErrorDailyForecast,
        errorDailyForecast,
        responseDailyForecast,
    } = useWeatherDaily(selectedLocation);

    const {
        isLoadingHourlyForecast,
        responseHourlyForecast,
        errorHourlyForecast,
        isErrorHourlyForecast
    } = useWeatherHourly(selectedLocation)


    console.log("responseDailyForecast", responseDailyForecast)

    return (
        <div className="homePage container">

            {isLoadingDailyForecast && (
                <Skeleton active paragraph={{rows: 4}}/>
            )}

            {isErrorDailyForecast && (
                <Alert
                    type="error"
                    showIcon
                    message="ვერ ჩავტვირთე პროგნოზი"
                    description={String(errorDailyForecast?.message || "Unknown error")}
                    style={{marginBottom: 16}}
                />
            )}

            {responseDailyForecast && (
                <Forecast
                    selectedLocation={selectedLocation}
                    setSelectedLocation={setSelectedLocation}
                    subline={`The low temperature will reach ${Math.round(
                        (responseDailyForecast?.["7day"]?.[0]?.temperature_min ?? 25)
                    )}° on this gloomy day`}
                    dailyData={responseDailyForecast}
                    hourlyData={responseHourlyForecast}
                />
            )}
        </div>
    );
}
