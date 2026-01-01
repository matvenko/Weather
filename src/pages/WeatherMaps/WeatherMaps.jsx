// src/pages/WeatherMaps.jsx
import React, {useEffect, useRef, useState} from "react";
import { Button } from "antd";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import "./weatherMaps.css"
import localBrandLogo from "@src/images/meteo-logo-white.png";
import MapPageHeader from "@src/components/MapPageHeader/MapPageHeader.jsx";


function loadScript(src, attrs = {}) {
    return new Promise((resolve, reject) => {
        // თუ უკვე ჩატვირთულია, resolve მაშინვე
        const existing = document.querySelector(`script[src="${src}"]`);
        if (existing) return existing.dataset.loaded === "true" ? resolve() : existing.addEventListener("load", resolve);

        const s = document.createElement("script");
        s.src = src;
        s.async = true;
        Object.entries(attrs).forEach(([k, v]) => (s[k] = v));
        s.addEventListener("load", () => {
            s.dataset.loaded = "true";
            resolve();
        });
        s.addEventListener("error", reject);
        document.head.appendChild(s);
    });
}

function loadStyle(href, attrs = {}) {
    return new Promise((resolve, reject) => {
        const existing = document.querySelector(`link[href="${href}"]`);
        if (existing) return resolve();
        const l = document.createElement("link");
        l.rel = "stylesheet";
        l.href = href;
        Object.entries(attrs).forEach(([k, v]) => (l[k] = v));
        l.addEventListener("load", resolve);
        l.addEventListener("error", reject);
        document.head.appendChild(l);
    });
}

const WeatherMaps = ({
                         apiKey = "kokojambo",
                         lang = "ka",
                         brandLogoSrc = localBrandLogo,
                         brandLogoHref = "/",
                         inventoryUrl = "https://weather-api.webmania.ge/api/v1/get_map_inventory",
                     }) => {
    const containerRef = useRef(null);
    const mapRef = useRef(null);
    const [isHeaderVisible, setIsHeaderVisible] = useState(false);

    function getLogo(href, src, title = "Meteo360", map) {
        const link = document.createElement('a');
        link.classList.add('logo-link', 'mbHideTooltip');
        link.href = href || "/";
        link.rel = "noopener noreferrer";
        link.setAttribute("aria-label", title);
        link.title = title;
        link.style.pointerEvents = "auto";

        const logo = document.createElement('img');
        logo.classList.add('logo');
        logo.src = src;
        logo.alt = title;
        link.appendChild(logo);

        const disable = () => {
            try {
                map?.dragPan?.disable();
                map?.scrollZoom?.disable();
                map?.boxZoom?.disable();
                map?.doubleClickZoom?.disable();
                map?.touchZoomRotate?.disable();
                map?.keyboard?.disable();
            } catch {
            }
        };
        const enable = () => {
            try {
                map?.dragPan?.enable();
                map?.scrollZoom?.enable();
                map?.boxZoom?.enable();
                map?.doubleClickZoom?.enable();
                map?.touchZoomRotate?.enable();
                map?.keyboard?.enable();
            } catch {
            }
        };

        link.addEventListener('mouseenter', disable);
        link.addEventListener('mouseleave', enable);
        link.addEventListener('touchstart', disable, {passive: true});
        link.addEventListener('touchend', enable);

        const killDown = (e) => {
            e.preventDefault();
            e.stopPropagation();
        };
        ['pointerdown', 'mousedown', 'touchstart'].forEach(evt => {
            link.addEventListener(evt, killDown);
            logo.addEventListener(evt, killDown);
        });

        const stopOnly = (e) => {
            e.stopPropagation();
        };
        ['click'].forEach(evt => {
            link.addEventListener(evt, stopOnly);
            logo.addEventListener(evt, stopOnly);
        });

        return link;
    }


    useEffect(() => {
        let destroyed = false;

        async function boot() {
            // 1) ჩავტვირთოთ Mapbox GL სტილი და JS meteoblue-ს CDN-იდან
            await loadStyle(
                "https://static.meteoblue.com/cdn/mapbox-gl-js/v1.11.1/mapbox-gl.css",
                {
                    integrity:
                        "sha512-xY1TAM00L9X8Su9zNuJ8nBZsGQ8IklX703iq4gWnsw6xCg+McrHXEwbBkNaWFHSqmf6e7BpxD6aJQLKAcsGSdA==",
                    crossOrigin: "anonymous",
                }
            );

            await loadScript(
                "https://static.meteoblue.com/cdn/mapbox-gl-js/v1.11.1/mapbox-gl.js",
                {
                    integrity:
                        "sha512-v5PfWsWi47/AZBVL7WMNqdbM1OMggp9Ce408yX/X9wg87Kjzb1xqpO2Ul0Oue8Vl9kKOcwPM2MWWkTbUjRxZOg==",
                    crossOrigin: "anonymous",
                }
            );

            // 2) ჩავტვირთოთ meteoblue Maps Plugin
            await loadScript("https://static.meteoblue.com/lib/maps-plugin/v0.x/maps-plugin.js");

            if (destroyed) return;

            // უსაფრთხოდ შევამოწმოთ გლობალური ობიექტები
            const {mapboxgl} = window;
            const {meteoblueMapsPlugin} = window;
            if (!mapboxgl || !meteoblueMapsPlugin) {
                console.error("meteoblue ან mapboxgl ვერ ჩაიტვირთა");
                return;
            }

            // 3) ავაწყოთ რუკა
            const map = new mapboxgl.Map({
                container: containerRef.current,
                center: [44.793, 41.715], // თბილისი
                zoom: 5,
                hash: "coords",
                attributionControl: false,
                keyboard: false,
            });
            mapRef.current = map;

            // 4) ვაჩვენოთ საქართველოს ჩარჩოები
            const georgiaBounds = [
                [40.0, 41.0], // სამხრეთ-დასავლეთი
                [47.5, 43.8], // ჩრდილო-აღმოსავლეთი
            ];
            map.fitBounds(georgiaBounds, {animate: false});
            map.setMaxBounds(georgiaBounds);
            map.setMinZoom(map.getZoom());

            // 5) ავამუშავოთ meteoblue plugin
            new meteoblueMapsPlugin({
                mapboxMap: map,
                inventory: inventoryUrl,
                apiKey,
                lang,
                canUseRestricted: true,
                content: {
                    top: getLogo(brandLogoHref, brandLogoSrc, "Meteo360", map),
                },
            });
        }

        boot();

        return () => {
            destroyed = true;
            // მოვასუფთავოთ რუკა unmount-ზე
            if (mapRef.current && mapRef.current.remove) {
                try {
                    mapRef.current.remove();
                } catch {
                }
            }
        };
    }, [apiKey, inventoryUrl, lang, brandLogoSrc, brandLogoHref]);

    return (
        <>
            {isHeaderVisible && <MapPageHeader disableAutoShow={true} />}

            {/* Header Toggle Button */}
            <Button
                type="primary"
                icon={isHeaderVisible ? <MdExpandLess style={{ fontSize: '24px' }} /> : <MdExpandMore style={{ fontSize: '24px' }} />}
                onClick={() => setIsHeaderVisible(!isHeaderVisible)}
                style={{
                    position: 'fixed',
                    top: isHeaderVisible ? '120px' : '0px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 1100,
                    borderRadius: isHeaderVisible ? '0 0 8px 8px' : '0 0 8px 8px',
                    background: 'rgba(26, 26, 46, 0.5)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '0px 9px',
                    height: 'auto',
                    width: '80'
                }}
            />

            <div className="wx-map-wrap">
                <div ref={containerRef} className="wx-map-container"/>
            </div>
        </>
    );
};

export default WeatherMaps;