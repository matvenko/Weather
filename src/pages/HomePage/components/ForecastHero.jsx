import React, {useState} from "react";
import { motion } from "framer-motion";
import { fadeUp, floatIcon, heroZoom, stagger } from "@src/ui/motion/variants.js";
import { fmtDayLong } from "@src/pages/HomePage/utils/homepage-utils.js";
import { iconByCode } from "@src/pages/HomePage/utils/weather-icons.js";
import TodayDetails from "@src/pages/HomePage/components/TodayDetails.jsx";
import SearchByLocation from "@src/pages/HomePage/components/SearchByLocation.jsx";

export default function ForecastHero({
                                         selectedLocation,
                                         setSelectedLocation,
                                         subline = "The low temperature will reach 25° on this gloomy day",
                                         selectedDay, // { time, temperature_mean, pictocode, ... }
                                     }) {



    return (
        <motion.div className="gw-hero-inner" variants={heroZoom}>
            <div>

                <SearchByLocation selectedLocation={selectedLocation} setSelectedLocation={setSelectedLocation}  />

                <motion.div className="gw-hero-text" variants={stagger(0.05, 0.05)}>
                    <motion.div className="kicker" variants={fadeUp}>Weather Forecast</motion.div>
                    <motion.h1 variants={fadeUp}>{selectedLocation?.name}</motion.h1>
                    <motion.p className="sub" variants={fadeUp}>{subline}</motion.p>
                </motion.div>
            </div>

            {/* Right mini-panel inside hero */}
            <motion.div className="today-forecast" variants={fadeUp}>
                <motion.div className="today-forecast-details-wrapper" variants={fadeUp}>
                    <div className="side-date">
                        {selectedDay && fmtDayLong(selectedDay.time)}
                    </div>

                    <motion.div className="side-temp" variants={floatIcon}>
                        {selectedDay ? Math.round(selectedDay.temperature_mean) : "—"}°
                        {selectedDay && iconByCode(selectedDay.pictocode)}
                    </motion.div>

                    {/* დეტალური რიგები ცალკე კომპონენტში */}
                    <TodayDetails day={selectedDay} />
                </motion.div>
            </motion.div>
        </motion.div>
    );
}
