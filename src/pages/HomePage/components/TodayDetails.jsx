import React from "react";
import { motion } from "framer-motion";
import { asideEnter, fadeUp } from "@src/ui/motion/variants.js";
import {
    degToCompass,
    msToKmh,
    fmtPrecipMm,
} from "@src/pages/HomePage/utils/homepage-utils.js";
import RainspotBadge from "@src/pages/HomePage/components/RainspotBadge.jsx";
import {
    WindDirectionIcon,
    WindSpeedIcon,
    PrecipitationIcon,
    PrecipitationProbabilityIcon,
} from "@src/pages/HomePage/components/WeatherDetailIcons.jsx";

export default function TodayDetails({ day }) {
    if (!day) return null;

    return (
        <motion.div
            key={day.time}
            className="today-forecast-details-info"
            variants={asideEnter}
        >
            <div className="s-row">
                <WindDirectionIcon size={18} direction={day.winddirection} />
                <span className="s-label">Wind Direction - </span>
                <span className="s-val">{degToCompass(day.winddirection)}</span>
            </div>

            <div className="s-row">
                <WindSpeedIcon size={18} />
                <span className="s-label">Wind speed (km/h) - </span>
                <span className="s-val">
          {msToKmh(day.windspeed_min)}-{msToKmh(day.windspeed_max)}
        </span>
            </div>

            <div className="s-row">
                <PrecipitationIcon size={18} />
                <span className="s-label">Precipitation - </span>
                <span className="s-val">{fmtPrecipMm(day.precipitation)}</span>
            </div>

            <div className="s-row">
                <PrecipitationProbabilityIcon size={18} />
                <span className="s-label">Precipitation probability - </span>
                <span className="s-val">
          {Math.round(day.precipitation_probability ?? 0)}%
        </span>
            </div>

            {/* rainSPOT */}
            {(day.rainspot ?? "").length > 0 && (
                <motion.div className="rainspot-box" variants={fadeUp}>
                    <span className="s-label">rainSPOT</span>
                    <div className="rainspot-icon">
                        <RainspotBadge rainspot={day.rainspot} tile={7} round={10} />
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}
