import React, { useEffect, useMemo, useRef } from "react";

/**
 * RainspotBadge
 * - rainspot: string of digits (0-9), e.g. "0111219..."
 * - tile: size of each cell in CSS pixels
 * - round: border radius of the badge
 */
export default function RainspotBadge({
                                          rainspot,
                                          tile = 8,
                                          round = 10,
                                      }) {
    const canvasRef = useRef(null);

    // ვიგებთ გიდის ზომას (ჩვეულებრივ 7x7 ან 9x9)
    const size = useMemo(() => {
        const n = Math.round(Math.sqrt(rainspot?.length || 0)) || 7;
        return n;
    }, [rainspot]);

    // სიხშირის → ფერი (ნარინჯისფერი პალიტრა, 0 გამჭვირვალე)
    const colorOf = (v) => {
        const t = Math.max(0, Math.min(9, Number(v))); // 0..9
        const alpha = t / 10;                           // 0 → 0, 9 → 0.9
        // ნარინჯისფერი გრადიენტი
        const g = 160 + Math.round(30 * (t / 9));       // 160..190
        return `rgba(255, ${g}, 95, ${alpha})`;
    };

    useEffect(() => {
        if (!rainspot || !canvasRef.current) return;
        const el = canvasRef.current;
        const dpr = window.devicePixelRatio || 1;
        const w = size * tile;
        const h = size * tile;

        // HiDPI support
        el.width = Math.round(w * dpr);
        el.height = Math.round(h * dpr);
        el.style.width = `${w}px`;
        el.style.height = `${h}px`;

        const ctx = el.getContext("2d");
        ctx.scale(dpr, dpr);

        // დავხატოთ უჯრები
        const cells = rainspot.split("");
        cells.forEach((ch, i) => {
            const x = i % size;
            const y = Math.floor(i / size);
            ctx.fillStyle = colorOf(ch);
            ctx.fillRect(x * tile, y * tile, tile, tile);
        });
    }, [rainspot, size, tile]);

    const px = size * tile;

    return (
        <div
            style={{
                position: "relative",
                width: px,
                height: px,
                borderRadius: round,
                overflow: "hidden",
                background: "rgba(0,0,0,.1)",
                border: "1px solid rgba(255,255,255,.15)",
                float: "right"
            }}
            aria-label="Rainspot radar"
        >
            <canvas ref={canvasRef} />
            <svg
                width={px} height={px}
                viewBox={`0 0 ${px} ${px}`}
                style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
            >
                {/* გარე რგოლი */}
                <circle cx={px/2} cy={px/2} r={px*0.42}
                        fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="1.5"/>
                {/* შიდა რგოლი */}
                <circle cx={px/2} cy={px/2} r={px*0.18}
                        fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="1.5"/>
                {/* ჯვარი */}
                <line x1={px*0.08} y1={px/2} x2={px*0.24} y2={px/2}
                      stroke="rgba(255,255,255,.35)" strokeWidth="1.5"/>
                <line x1={px*0.76} y1={px/2} x2={px*0.92} y2={px/2}
                      stroke="rgba(255,255,255,.35)" strokeWidth="1.5"/>
                <line x1={px/2} y1={px*0.08} x2={px/2} y2={px*0.24}
                      stroke="rgba(255,255,255,.35)" strokeWidth="1.5"/>
                <line x1={px/2} y1={px*0.76} x2={px/2} y2={px*0.92}
                      stroke="rgba(255,255,255,.35)" strokeWidth="1.5"/>
            </svg>
        </div>
    );
}
