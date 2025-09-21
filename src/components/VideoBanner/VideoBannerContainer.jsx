import React, {useEffect, useRef} from 'react';
import "./VideoBanner.css";

import mainVideo from "./Mp4/main.mp4";

const VideoBannerContainer = () => {
    const videoRef = useRef(null);

    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;

        v.muted = true;

        // დაუყოვნებლივ ჩართვა
        const p = v.play?.();
        if (p && typeof p.then === "function") {
            p.catch(() => {
                // თუ autoplay დაიბლოკა, ჩავრთოთ პირველივე მომხმარებლის შეხებაზე
                const tryPlay = () => {
                    v.play().finally(() => {
                        window.removeEventListener("touchstart", tryPlay);
                        window.removeEventListener("click", tryPlay);
                    });
                };
                window.addEventListener("touchstart", tryPlay, {once: true});
                window.addEventListener("click", tryPlay, {once: true});
            });
        }
    }, []);
    return (
        <div className="banner-layer">
            <video
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className="w-full h-[60vh] object-cover rounded-2xl myVideo"
                poster="/video-poster.jpg"
            >
                <source src={mainVideo} type="video/mp4" />
            </video>
            <div className="main-content-top"></div>
        </div>

    );
};

export default VideoBannerContainer;