import React, { useEffect } from "react";

const HomePage = () => {
    useEffect(() => {
        // Dynamically load Mapbox JS
        const scriptMapbox = document.createElement("script");
        scriptMapbox.src =
            "https://static.meteoblue.com/cdn/mapbox-gl-js/v1.11.1/mapbox-gl.js";
        scriptMapbox.integrity =
            "sha512-v5PfWsWi47/AZBVL7WMNqdbM1OMggp9Ce408yX/X9wg87Kjzb1xqpO2Ul0Oue8Vl9kKOcwPM2MWWkTbUjRxZOg==";
        scriptMapbox.crossOrigin = "anonymous";
        scriptMapbox.async = true;
        document.body.appendChild(scriptMapbox);

        // Dynamically load Meteoblue maps plugin
        const scriptPlugin = document.createElement("script");
        scriptPlugin.src =
            "https://static.meteoblue.com/lib/maps-plugin/v0.x/maps-plugin.js";
        scriptPlugin.async = true;
        document.body.appendChild(scriptPlugin);

        // Dynamically load CSS
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href =
            "https://static.meteoblue.com/cdn/mapbox-gl-js/v1.11.1/mapbox-gl.css";
        link.integrity =
            "sha512-xY1TAM00L9X8Su9zNuJ8nBZsGQ8IklX703iq4gWnsw6xCg+McrHXEwbBkNaWFHSqmf6e7BpxD6aJQLKAcsGSdA==";
        link.crossOrigin = "anonymous";
        document.head.appendChild(link);

        // Wait until scripts load, then init map
        scriptPlugin.onload = () => {
            if (window.mapboxgl && window.meteoblueMapsPlugin) {
                const mapboxMap = new window.mapboxgl.Map({
                    container: "mapContainer",
                    center: [44.8341, 41.6914],
                    zoom: 5,
                    minZoom: 0,
                    maxZoom: 12,
                    hash: false,
                    attributionControl: false,
                    keyboard: false,
                    maxBounds: [
                        [40.01, 41.055],
                        [46.735, 43.586],
                    ],
                });

                const getLogo = () => {
                    const link = document.createElement("a");
                    link.classList.add("logo-link", "mbHideTooltip");
                    mapboxMap.on("idle", function () {
                        link.href = "http://meteoblue.com/";
                    });

                    const logo = document.createElement("img");
                    logo.classList.add("logo");
                    logo.src =
                        "https://static.meteoblue.com/assets/images/webmaps/meteoblue_logo-glow.png";
                    link.appendChild(logo);

                    return link;
                };

                const apiKey = "KtnXj4ZgxakBohcU"; // <-- replace with your API key
                const inventoryUrl = "https://weather-api.webmania.ge/api/v1/test";

                new window.meteoblueMapsPlugin({
                    mapboxMap: mapboxMap,
                    inventory: inventoryUrl,
                    apiKey: apiKey,
                    canUseRestricted: true,
                    content: { top: getLogo() },
                });
            }
        };

        // Cleanup on unmount
        return () => {
            document.body.removeChild(scriptMapbox);
            document.body.removeChild(scriptPlugin);
        };
    }, []);

    return (
        <div>
            <div>
                HomePage
            </div>
        </div>
    );
};

export default HomePage;
