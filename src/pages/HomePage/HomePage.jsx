import React, {useState} from "react";
import "./css/Homepage.css";
import {useTranslation} from "react-i18next";
import {useWeatherDaily} from "@src/pages/HomePage/hooks/useWeatherDaily.js";
import {Skeleton, Alert, Typography} from "antd";
import MetroWeatherWidget from "@src/pages/HomePage/components/WeatherWidget.jsx";
import {useWeatherHourly} from "@src/pages/HomePage/hooks/useWeatherHourly.js";

const {Title, Text} = Typography;

export default function HomePage() {
    const {t} = useTranslation();
    const [queryParams] = useState({lat: 41.6914, lon: 44.8341});


    const {
        isLoadingDailyForecast,
        isErrorDailyForecast,
        errorDailyForecast,
        responseDailyForecast,
    } = useWeatherDaily(queryParams);

    const {
        isLoadingHourlyForecast,
        responseHourlyForecast,
        errorHourlyForecast,
        isErrorHourlyForecast
    } = useWeatherHourly(queryParams)


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
                <MetroWeatherWidget
                    location="Tbilisi, Georgia"
                    headline="Overcast cloudy"
                    subline={`The low temperature will reach ${Math.round(
                        (responseDailyForecast?.[0]?.temperature_min ?? 25)
                    )}° on this gloomy day`}
                    queryParams={queryParams}
                    daily={responseDailyForecast || []}
                    hourly={responseHourlyForecast || []}
                />
            )}
        </div>
    );
}
