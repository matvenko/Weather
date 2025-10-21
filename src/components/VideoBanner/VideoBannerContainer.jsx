// VideoBannerContainer.jsx
import React, { useEffect, useRef, useMemo } from "react";
import "./VideoBanner.css";
import fallbackVideo from "./Mp4/main.mp4"; // fallback
import { useSelector } from "react-redux";
import { selectCurrentBackgroundFile } from "@src/features/app/appSlice.js";

// 1) აგროვებს build-ის დროს ყველა mp4/webm/ogg ფაილს ამ დირექტორიიდან (და ქვე-ფოლდერებიდან)
const videoRegistry = import.meta.glob("./Mp4/**/*.{mp4,webm,ogg}", {
    eager: true,
    import: "default",
});

/**
 * resolveVideoSrc(raw):
 * - თუ არის absolute URL (http/https), public path (/Mp4/..), blob:, data: — დააბრუნე როგორც არის
 * - თუ არის მხოლოდ ფაილის სახელი ან რელატიური ბილიკი, სცადე registry-დან ამოღება
 */
function resolveVideoSrc(raw) {
    if (!raw) return "";

    const s = String(raw).trim();

    // Absolute URLs or special schemes
    if (
        s.startsWith("http://") ||
        s.startsWith("https://") ||
        s.startsWith("blob:") ||
        s.startsWith("data:video")
    ) {
        return s;
    }

    // Public assets (public/...) — იმართება პირდაპირ
    if (s.startsWith("/")) {
        // მაგ: "/Mp4/cloudy.mp4"
        return s;
    }

    // მაგ: "./Mp4/cloudy.mp4"
    if (videoRegistry[s]) {
        return videoRegistry[s];
    }

    // basename-ით match (როდესაც state-ში მხოლოდ "cloudy.mp4" წერია)
    const byName = Object.entries(videoRegistry).find(([key]) =>
        key.toLowerCase().endsWith("/" + s.toLowerCase())
    );
    if (byName) return byName[1];

    // ვერ იპოვა
    return "";
}

export default function VideoBannerContainer() {
    const backgroundFile = useSelector(selectCurrentBackgroundFile);
    const videoRef = useRef(null);

    const src = useMemo(() => {
        const resolved = resolveVideoSrc(backgroundFile);
        return resolved || fallbackVideo;
    }, [backgroundFile]);

    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;

        v.pause();
        const play = () => {
            v.muted = true;
            const p = v.play?.();
            if (p && typeof p.then === "function") {
                p.catch(() => {
                    const tryPlay = () => {
                        v.play().finally(() => {
                            window.removeEventListener("touchstart", tryPlay);
                            window.removeEventListener("click", tryPlay);
                        });
                    };
                    window.addEventListener("touchstart", tryPlay, { once: true });
                    window.addEventListener("click", tryPlay, { once: true });
                });
            }
        };
        play();
    }, [src]);

    return (
        <div className="banner-layer">
            <video
                key={src}                 // გარანტირებული re-mount, როცა იცვლება
                ref={videoRef}
                src={src}                 // პირდაპირ video.src ვიყენებთ
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className="w-full h-[60vh] object-cover rounded-2xl myVideo"
                poster="/video-poster.jpg"
            />
            <div className="main-content-top"></div>
        </div>
    );
}
