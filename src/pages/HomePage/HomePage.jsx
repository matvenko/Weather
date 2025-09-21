import React, { useState } from "react";
import "./css/Homepage.css";
import { useTranslation } from "react-i18next";
import { useWeatherDaily } from "@src/pages/HomePage/hooks/useWeatherDaily.js";
import { Skeleton, Alert, Typography } from "antd";
import MetroWeatherWidget from "@src/pages/HomePage/components/MetroWeatherWidget.jsx";

const { Title, Text } = Typography;

export default function HomePage() {
    const { t } = useTranslation();
    const [queryParams] = useState({ lat: 41.6914, lon: 44.8341 });

    const {
        isLoadingDailyForecast,
        isErrorDailyForecast,
        errorDailyForecast,
        responseDailyForecast,
    } = useWeatherDaily(queryParams);

    return (
        <div className="homePage container">

            {isLoadingDailyForecast && (
                <Skeleton active paragraph={{ rows: 4 }} />
            )}

            {isErrorDailyForecast && (
                <Alert
                    type="error"
                    showIcon
                    message="ვერ ჩავტვირთე პროგნოზი"
                    description={String(errorDailyForecast?.message || "Unknown error")}
                    style={{ marginBottom: 16 }}
                />
            )}

            {responseDailyForecast && (
                <MetroWeatherWidget
                    locationName="Tbilisi"
                    backgroundImage="https://imengine.public.prod.cmg.infomaker.io/?uuid=84860344-c8d8-51ee-b191-943a4ff8b68d&function=cropresize&type=preview&source=false&q=75&crop_w=0.99999&crop_h=0.9997&x=0&y=0&width=1500&height=844" /* სურვილისამებრ */
                    current={{
                        temperature: Math.round(responseDailyForecast?.[0]?.temperature_instant ?? 16),
                        description: "Overcast",
                        precipitation_probability: responseDailyForecast?.[0]?.precipitation_probability ?? 0,
                        relativehumidity: responseDailyForecast?.[0]?.relativehumidity_mean ?? 0,
                        windspeed: responseDailyForecast?.[0]?.windspeed_mean ?? 0,
                        winddirection: responseDailyForecast?.[0]?.winddirection ?? 0,
                    }}
                    daily={responseDailyForecast || []}
                />
            )}
        </div>
    );
}
