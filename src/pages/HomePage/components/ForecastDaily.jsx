// src/pages/HomePage/components/ForecastDaily.jsx
import React from "react";
import { motion } from "framer-motion";
import { listItem, stagger } from "@src/ui/motion/variants.js";

export default function ForecastDaily({
                                        items = [],
                                        isActive = () => false,
                                        onSelect = () => {},
                                        renderLabel,
                                    }) {
    const hasItems = Array.isArray(items) && items.length > 0;

    return (
        <motion.aside
            className="gw-side glass"
            initial="hidden"
            animate="show"
            variants={stagger(0.05, 0.05)}
        >
            <motion.div className="side-next-title" variants={listItem}>
                The Next Day Forecast
            </motion.div>

            {!hasItems ? (
                // --- Fallback / Empty state (დაგეხმარება დიაგნოსტიკაში) ---
                <div className="side-list-empty" style={{ opacity: 0.8 }}>
                    No days to show
                </div>
            ) : (
                <motion.ul className="side-list" variants={stagger(0.05, 0.05)}>
                    {items.map((d) => {
                        const active = isActive(d);
                        return (
                            <motion.li
                                key={d.time || String(d?.id || Math.random())}
                                className={active ? "is-active" : ""}
                                role="button"
                                tabIndex={0}
                                aria-selected={active}
                                onClick={() => onSelect(d)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        onSelect(d);
                                    }
                                }}
                                variants={listItem}
                            >
                                {renderLabel ? renderLabel(d) : null}
                            </motion.li>
                        );
                    })}
                </motion.ul>
            )}
        </motion.aside>
    );
}
