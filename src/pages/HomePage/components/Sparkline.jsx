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
                    <linearGradient id="gw-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="currentColor" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                    </linearGradient>
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
