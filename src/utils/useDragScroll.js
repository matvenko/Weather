// @src/utils/useDragScroll.js
import { useEffect, useRef } from "react";

/**
 * Drag (mouse only) to scroll horizontally.
 * Touch devices use native overflow scroll for inertial (momentum) scrolling.
 * - No React state updates.
 * - Disables scroll-snap during drag to prevent jump-to-start.
 * - Works when pointer leaves the element (listeners on window).
 */
export default function useDragScroll() {
    const ref = useRef(null);
    const draggingRef = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        let startX = 0;
        let startScrollLeft = 0;
        let prevBehavior = "";
        let prevSnapType = "";

        const onDown = (e) => {
            // Touch/stylus → native scroll handles it (gives free inertia)
            if (e.pointerType !== "mouse") return;
            if (e.button !== 0) return;

            draggingRef.current = true;
            startX = e.clientX;
            startScrollLeft = el.scrollLeft;

            prevBehavior = el.style.scrollBehavior || "";
            prevSnapType = el.style.scrollSnapType || "";

            el.style.scrollBehavior = "auto";
            el.style.scrollSnapType = "none";
            el.classList.add("is-dragging");

            try { el.setPointerCapture?.(e.pointerId); } catch {}
            e.preventDefault();
        };

        const onMove = (e) => {
            if (!draggingRef.current) return;
            if (e.buttons === 0) { onUp(e); return; }

            const dx = e.clientX - startX;
            el.scrollLeft = startScrollLeft - dx;
            e.preventDefault?.();
        };

        const onUp = (e) => {
            if (!draggingRef.current) return;
            draggingRef.current = false;

            try { el.releasePointerCapture?.(e.pointerId); } catch {}

            el.style.scrollBehavior = prevBehavior;
            el.style.scrollSnapType = prevSnapType;
            el.classList.remove("is-dragging");
        };

        el.addEventListener("pointerdown", onDown, { passive: false });
        window.addEventListener("pointermove", onMove, { passive: false });
        window.addEventListener("pointerup", onUp, { passive: true });
        window.addEventListener("pointercancel", onUp, { passive: true });

        return () => {
            el.removeEventListener("pointerdown", onDown);
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerup", onUp);
            window.removeEventListener("pointercancel", onUp);
        };
    }, []);

    return { ref, isDraggingRef: draggingRef };
}
