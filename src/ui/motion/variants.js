// გლობალური ეზინგები/დიურაციები
export const MOTION = {
    easing: {
        standard: [0.22, 1, 0.36, 1],
        entrance: [0.16, 1, 0.3, 1],
        exit: [0.4, 0, 1, 1],
    },
    duration: {
        xs: 0.25,
        sm: 0.35,
        md: 0.6,
        lg: 0.8,
    },
};

// ---------- Helpers ----------
export const stagger = (staggerChildren = 0.06, delayChildren = 0.04) => ({
    hidden: {},
    show: { transition: { staggerChildren, delayChildren } },
});

// ზოგადი fade/slide/zoom ფაბრიკები
export const makeFadeUp = (dy = 18, blur = 6, dur = MOTION.duration.md) => ({
    hidden: { opacity: 0, y: dy, filter: `blur(${blur}px)` },
    show: {
        opacity: 1, y: 0, filter: "blur(0px)",
        transition: { duration: dur, ease: MOTION.easing.standard },
    },
});

export const makeFadeIn = (dur = MOTION.duration.sm) => ({
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: dur, ease: MOTION.easing.standard } },
});

export const makeSlideIn = (axis = "x", amount = 20, dur = MOTION.duration.sm) => {
    const off = axis === "y" ? { y: amount } : { x: amount };
    const on = axis === "y" ? { y: 0 } : { x: 0 };
    return {
        hidden: { opacity: 0, ...off },
        show: { opacity: 1, ...on, transition: { duration: dur, ease: MOTION.easing.entrance } },
    };
};

export const makeZoomIn = (scaleFrom = 1.02, dur = MOTION.duration.lg) => ({
    hidden: { opacity: 0, scale: scaleFrom },
    show: { opacity: 1, scale: 1, transition: { duration: dur, ease: MOTION.easing.standard } },
});

// ხაზის/ბილდის ანიმაცია (svg pathLength)
export const drawPath = (dur = 1.2) => ({
    hidden: { pathLength: 0 },
    show: { pathLength: 1, transition: { duration: dur, ease: "easeInOut" } },
});

// hover/tap მინიპრესეტები (use whileHover/whileTap-ზე)
export const hoverLift = { y: -2, transition: { duration: MOTION.duration.xs } };
export const tapShrink = { scale: 0.98, transition: { duration: MOTION.duration.xs } };

// ---------- Project presets (შენთვის შესაბამისი, უკვე გამზადებული) ----------
export const fadeUp = makeFadeUp();                     // == შენი ძველი fadeUp
export const floatIcon = {
    hidden: { opacity: 0, scale: 0.9, rotate: -3 },
    show: {
        opacity: 1, scale: 1, rotate: 0,
        transition: { duration: 0.7, ease: MOTION.easing.standard },
    },
};
export const heroZoom = makeZoomIn(1.02);               // == შენი ძველი heroZoom
export const listItem = makeSlideIn("x", 10, 0.35);     // == შენი ძველი listItem
export const asideEnter = makeSlideIn("x", 40, 0.45);   // == შენი ძველი asideEnter

// a11y: თუ გინდა programmatically გამორთო მოძრაობა
export const reduceMotion = (variants) => ({
    hidden: { opacity: variants.hidden?.opacity ?? 0 },
    show: { opacity: variants.show?.opacity ?? 1, transition: { duration: 0.01 } },
});


export const staggerCol = {
    hidden: {},
    show: {transition: {staggerChildren: 0.05, delayChildren: 0.05}},
};

export const drawLine = {
    hidden: {pathLength: 0},
    show: {pathLength: 1, transition: {duration: 1.2, ease: "easeInOut"}},
};

