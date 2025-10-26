import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSparkline } from "@src/pages/HomePage/utils/homepage-utils.js";
import { drawLine } from "@src/ui/motion/variants.js";

export default function Sparkline({ values = [] }) {
    const nums = useMemo(
        () => (values || []).map(Number).filter(Number.isFinite),
        [values]
    );

    const { d: pathD } = useSparkline(nums);
    const hasPath = !!pathD && pathD.startsWith("M");

    return (
        <div className="sparkline">
            <svg viewBox="0 0 680 110" preserveAspectRatio="none">
                <defs>
                    {/* Gradient for area fill */}
                    <linearGradient id="gw-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#f5bd52" stopOpacity="0.35" />
                        <stop offset="50%" stopColor="#f5bd52" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="#f5bd52" stopOpacity="0" />
                    </linearGradient>

                    {/* Gradient for the line stroke */}
                    <linearGradient id="gw-line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f5bd52" stopOpacity="0.8" />
                        <stop offset="50%" stopColor="#ffd67a" stopOpacity="1" />
                        <stop offset="100%" stopColor="#f5bd52" stopOpacity="0.8" />
                    </linearGradient>

                    {/* Glow filter for the line */}
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>

                <AnimatePresence mode="wait">
                    <motion.path
                        key={`spark-${nums.join(",")}`}
                        className="line"
                        d={hasPath ? pathD : "M0 110 L680 110"}
                        style={{ pathLength: 0 }}
                        variants={drawLine}
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                    />
                </AnimatePresence>

                {hasPath && <path className="fill" d={`${pathD} L 680 110 L 0 110 Z`} />}
            </svg>
        </div>
    );
}
