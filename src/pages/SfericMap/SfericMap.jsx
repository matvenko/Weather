import React, { useEffect, useRef, useState, useCallback } from "react";
import { MdFlashOn, MdMyLocation, MdRefresh } from "react-icons/md";
import localBrandLogo from "@src/images/meteo-logo-white.png";
import "./sfericMap.css";

// WebSocket URL for Earth Networks lightning data - configurable via env
const LIGHTNING_API_KEY = import.meta.env.VITE_SFERIC_API_KEY || "8E2A3C14-B44A-41AC-A0B8-74AA1123A912";
const LIGHTNING_WS_URL = `wss://lx.wsapi.earthnetworks.com/ws/?p=${LIGHTNING_API_KEY}&f=json&t=pulse&l=all&k=on`;

// Radius in kilometers
const RADIUS_KM = 10;

// Demo mode - simulates lightning strikes when WebSocket is not available
const DEMO_ENABLED = true;

// Create circle GeoJSON for given center and radius in km
function createCircleGeoJSON(center, radiusKm, points = 64) {
    const coords = [];
    const km = radiusKm;
    const distanceX = km / (111.32 * Math.cos((center[1] * Math.PI) / 180));
    const distanceY = km / 110.574;

    for (let i = 0; i < points; i++) {
        const theta = (i / points) * (2 * Math.PI);
        const x = distanceX * Math.cos(theta);
        const y = distanceY * Math.sin(theta);
        coords.push([center[0] + x, center[1] + y]);
    }
    coords.push(coords[0]); // Close the circle

    return {
        type: "Feature",
        geometry: {
            type: "Polygon",
            coordinates: [coords],
        },
    };
}

// Using meteoblue's hosted Mapbox (same as WeatherMaps)
const MAPBOX_STYLE = {
    version: 8,
    sources: {
        osm: {
            type: "raster",
            tiles: [
                "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
                "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
                "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
            ],
            tileSize: 256,
            attribution: "&copy; OpenStreetMap Contributors"
        },
        satellite: {
            type: "raster",
            tiles: [
                "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            ],
            tileSize: 256,
            attribution: "&copy; Esri"
        }
    },
    layers: [
        {
            id: "satellite",
            type: "raster",
            source: "satellite",
            minzoom: 0,
            maxzoom: 19
        }
    ]
};

function loadScript(src, attrs = {}) {
    return new Promise((resolve, reject) => {
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

const SfericMap = () => {
    const containerRef = useRef(null);
    const mapRef = useRef(null);
    const wsRef = useRef(null);
    const markersRef = useRef([]);
    const userMarkerRef = useRef(null);
    const reconnectAttemptsRef = useRef(0);
    const demoIntervalRef = useRef(null);
    const maxReconnectAttempts = 5;

    const [isLoading, setIsLoading] = useState(true);
    const [isConnected, setIsConnected] = useState(false);
    const [isDemoMode, setIsDemoMode] = useState(false);
    const [wsError, setWsError] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [locationError, setLocationError] = useState(null);
    const [stats, setStats] = useState({
        totalStrikes: 0,
        lastMinute: 0,
        lastStrikeTime: null,
        strikesInRadius: 0,
    });

    // Calculate distance between two points in km (Haversine formula)
    const calculateDistance = useCallback((lat1, lon1, lat2, lon2) => {
        const R = 6371; // Earth's radius in km
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }, []);

    // Clean up old markers (older than 5 minutes)
    const cleanupOldMarkers = useCallback(() => {
        const now = Date.now();
        const fiveMinutesAgo = now - 5 * 60 * 1000;

        markersRef.current = markersRef.current.filter(item => {
            if (item.timestamp < fiveMinutesAgo) {
                item.marker.remove();
                return false;
            }
            return true;
        });
    }, []);

    // Add lightning strike marker
    const addLightningMarker = useCallback((lng, lat, data) => {
        if (!mapRef.current) return;

        const el = document.createElement("div");
        el.className = "lightning-marker";

        // Create marker
        const marker = new window.mapboxgl.Marker(el)
            .setLngLat([lng, lat])
            .addTo(mapRef.current);

        // Store marker with timestamp
        markersRef.current.push({
            marker,
            timestamp: Date.now(),
            data,
        });

        // Check if strike is within radius of user location
        let isInRadius = false;
        if (userLocation) {
            const distance = calculateDistance(userLocation.lat, userLocation.lng, lat, lng);
            isInRadius = distance <= RADIUS_KM;
        }

        // Update stats
        setStats(prev => ({
            totalStrikes: prev.totalStrikes + 1,
            lastMinute: prev.lastMinute + 1,
            lastStrikeTime: new Date().toLocaleTimeString("ka-GE"),
            strikesInRadius: isInRadius ? prev.strikesInRadius + 1 : prev.strikesInRadius,
        }));

        // Remove marker after animation
        setTimeout(() => {
            marker.remove();
            markersRef.current = markersRef.current.filter(m => m.marker !== marker);
        }, 10000);
    }, [userLocation, calculateDistance]);

    // Start demo mode - simulate lightning strikes around Georgia
    const startDemoMode = useCallback(() => {
        if (demoIntervalRef.current) return;

        setIsDemoMode(true);
        console.log("Starting demo mode - simulating lightning strikes");

        // Georgia bounds for random lightning
        const bounds = {
            minLat: 41.0,
            maxLat: 43.5,
            minLng: 40.0,
            maxLng: 46.5,
        };

        // Generate random lightning every 2-5 seconds
        const generateStrike = () => {
            if (!mapRef.current) return;

            const lat = bounds.minLat + Math.random() * (bounds.maxLat - bounds.minLat);
            const lng = bounds.minLng + Math.random() * (bounds.maxLng - bounds.minLng);

            addLightningMarker(lng, lat, { demo: true });
        };

        // Initial strikes
        for (let i = 0; i < 3; i++) {
            setTimeout(generateStrike, i * 500);
        }

        // Continuous generation
        demoIntervalRef.current = setInterval(() => {
            generateStrike();
            // Sometimes generate multiple strikes in quick succession (storm simulation)
            if (Math.random() > 0.7) {
                setTimeout(generateStrike, 200);
            }
        }, 2000 + Math.random() * 3000);
    }, [addLightningMarker]);

    // Stop demo mode
    const stopDemoMode = useCallback(() => {
        if (demoIntervalRef.current) {
            clearInterval(demoIntervalRef.current);
            demoIntervalRef.current = null;
        }
        setIsDemoMode(false);
    }, []);

    // Connect to WebSocket
    const connectWebSocket = useCallback(() => {
        if (wsRef.current?.readyState === WebSocket.OPEN) return;

        if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
            setWsError(`კავშირი ვერ დამყარდა ${maxReconnectAttempts} მცდელობის შემდეგ`);
            return;
        }

        try {
            const ws = new WebSocket(LIGHTNING_WS_URL);
            wsRef.current = ws;

            ws.onopen = () => {
                console.log("Lightning WebSocket connected");
                setIsConnected(true);
                setWsError(null);
                reconnectAttemptsRef.current = 0;
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);

                    // Handle lightning pulse data
                    if (data.lat && data.lon) {
                        addLightningMarker(data.lon, data.lat, data);
                    }

                    // Handle array of pulses
                    if (Array.isArray(data)) {
                        data.forEach(pulse => {
                            if (pulse.lat && pulse.lon) {
                                addLightningMarker(pulse.lon, pulse.lat, pulse);
                            }
                        });
                    }
                } catch (e) {
                    // Ignore non-JSON messages (like keep-alive)
                }
            };

            ws.onerror = (error) => {
                console.error("Lightning WebSocket error:", error);
                setWsError("WebSocket კავშირის შეცდომა");
            };

            ws.onclose = () => {
                console.log("Lightning WebSocket disconnected");
                setIsConnected(false);
                reconnectAttemptsRef.current += 1;

                if (reconnectAttemptsRef.current < maxReconnectAttempts) {
                    // Reconnect after 5 seconds
                    setTimeout(connectWebSocket, 5000);
                } else {
                    setWsError(`კავშირი ვერ დამყარდა ${maxReconnectAttempts} მცდელობის შემდეგ`);
                    // Start demo mode if enabled
                    if (DEMO_ENABLED) {
                        startDemoMode();
                    }
                }
            };
        } catch (error) {
            console.error("Failed to create WebSocket:", error);
            setWsError("WebSocket შექმნა ვერ მოხერხდა");
            // Start demo mode if enabled
            if (DEMO_ENABLED) {
                startDemoMode();
            }
        }
    }, [addLightningMarker, startDemoMode]);

    // Initialize map
    useEffect(() => {
        let destroyed = false;

        async function initMap() {
            // Load Mapbox GL from meteoblue CDN (same as WeatherMaps)
            await loadStyle(
                "https://static.meteoblue.com/cdn/mapbox-gl-js/v1.11.1/mapbox-gl.css",
                {
                    integrity: "sha512-xY1TAM00L9X8Su9zNuJ8nBZsGQ8IklX703iq4gWnsw6xCg+McrHXEwbBkNaWFHSqmf6e7BpxD6aJQLKAcsGSdA==",
                    crossOrigin: "anonymous",
                }
            );
            await loadScript(
                "https://static.meteoblue.com/cdn/mapbox-gl-js/v1.11.1/mapbox-gl.js",
                {
                    integrity: "sha512-v5PfWsWi47/AZBVL7WMNqdbM1OMggp9Ce408yX/X9wg87Kjzb1xqpO2Ul0Oue8Vl9kKOcwPM2MWWkTbUjRxZOg==",
                    crossOrigin: "anonymous",
                }
            );

            if (destroyed) return;

            const { mapboxgl } = window;
            if (!mapboxgl) {
                console.error("Mapbox GL failed to load");
                return;
            }

            // Create map
            const map = new mapboxgl.Map({
                container: containerRef.current,
                style: MAPBOX_STYLE,
                center: [44.793, 41.715], // Tbilisi
                zoom: 6,
                attributionControl: false,
            });

            mapRef.current = map;

            map.on("load", () => {
                setIsLoading(false);
                // Add navigation controls
                map.addControl(new mapboxgl.NavigationControl(), "bottom-right");

                // Request geolocation
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            const { latitude, longitude } = position.coords;
                            const userLoc = { lat: latitude, lng: longitude };
                            setUserLocation(userLoc);

                            // Center map on user location
                            map.flyTo({
                                center: [longitude, latitude],
                                zoom: 10,
                                duration: 1500,
                            });

                            // Add user location marker
                            const userEl = document.createElement("div");
                            userEl.className = "user-location-marker";
                            userMarkerRef.current = new mapboxgl.Marker(userEl)
                                .setLngLat([longitude, latitude])
                                .addTo(map);

                            // Add 10km radius circle
                            map.addSource("radius-circle", {
                                type: "geojson",
                                data: createCircleGeoJSON([longitude, latitude], RADIUS_KM),
                            });

                            map.addLayer({
                                id: "radius-circle-fill",
                                type: "fill",
                                source: "radius-circle",
                                paint: {
                                    "fill-color": "#4fc3f7",
                                    "fill-opacity": 0.1,
                                },
                            });

                            map.addLayer({
                                id: "radius-circle-stroke",
                                type: "line",
                                source: "radius-circle",
                                paint: {
                                    "line-color": "#4fc3f7",
                                    "line-width": 2,
                                    "line-opacity": 0.8,
                                },
                            });
                        },
                        (error) => {
                            console.error("Geolocation error:", error);
                            setLocationError(error.message);
                            // Fallback to Georgia bounds if geolocation fails
                            const georgiaBounds = [
                                [38.0, 40.5],
                                [48.5, 44.0],
                            ];
                            map.fitBounds(georgiaBounds, { animate: false, padding: 50 });
                        },
                        {
                            enableHighAccuracy: true,
                            timeout: 10000,
                            maximumAge: 0,
                        }
                    );
                } else {
                    setLocationError("Geolocation არ არის მხარდაჭერილი");
                    // Fallback to Georgia bounds
                    const georgiaBounds = [
                        [38.0, 40.5],
                        [48.5, 44.0],
                    ];
                    map.fitBounds(georgiaBounds, { animate: false, padding: 50 });
                }

                // Connect to lightning WebSocket
                connectWebSocket();
            });
        }

        initMap();

        // Cleanup interval for old markers
        const cleanupInterval = setInterval(cleanupOldMarkers, 60000);

        // Reset last minute counter every minute
        const statsInterval = setInterval(() => {
            setStats(prev => ({ ...prev, lastMinute: 0 }));
        }, 60000);

        return () => {
            destroyed = true;
            clearInterval(cleanupInterval);
            clearInterval(statsInterval);

            if (demoIntervalRef.current) {
                clearInterval(demoIntervalRef.current);
            }
            if (wsRef.current) {
                wsRef.current.close();
            }
            if (mapRef.current) {
                mapRef.current.remove();
            }
        };
    }, [connectWebSocket, cleanupOldMarkers]);

    // Retry connection handler
    const handleRetryConnection = useCallback(() => {
        stopDemoMode();
        setWsError(null);
        reconnectAttemptsRef.current = 0;
        setStats({
            totalStrikes: 0,
            lastMinute: 0,
            lastStrikeTime: null,
            strikesInRadius: 0,
        });
        // Clear all markers
        markersRef.current.forEach(item => item.marker.remove());
        markersRef.current = [];
        // Try to connect again
        connectWebSocket();
    }, [stopDemoMode, connectWebSocket]);

    return (
        <div className="sferic-map-wrap">
            <div ref={containerRef} className="sferic-map-container" />

            {isLoading && (
                <div className="sferic-loading">
                    <div className="sferic-loading-spinner" />
                    <div className="sferic-loading-text">რუკა იტვირთება...</div>
                </div>
            )}

            {/* Logo */}
            <a href="/" className="sferic-logo">
                <img src={localBrandLogo} alt="Meteo360" />
            </a>

            {/* Control Panel */}
            <div className="sferic-controls">
                <h3>
                    <MdFlashOn />
                    ელვის მონიტორინგი
                </h3>
                <div className="sferic-stats">
                    {userLocation && (
                        <div className="sferic-stat location-info">
                            <MdMyLocation style={{ color: "#4fc3f7" }} />
                            <span>{RADIUS_KM} კმ რადიუსი</span>
                        </div>
                    )}
                    {userLocation && (
                        <div className="sferic-stat">
                            <span>რადიუსში:</span>
                            <span className="sferic-stat-value highlight">{stats.strikesInRadius}</span>
                        </div>
                    )}
                    <div className="sferic-stat">
                        <span>სულ დარტყმები:</span>
                        <span className="sferic-stat-value">{stats.totalStrikes}</span>
                    </div>
                    <div className="sferic-stat">
                        <span>ბოლო წუთში:</span>
                        <span className="sferic-stat-value">{stats.lastMinute}</span>
                    </div>
                    {stats.lastStrikeTime && (
                        <div className="sferic-stat">
                            <span>ბოლო დარტყმა:</span>
                            <span className="sferic-stat-value">{stats.lastStrikeTime}</span>
                        </div>
                    )}
                </div>
                <div className="connection-status">
                    <div className={`status-dot ${isConnected ? "connected" : isDemoMode ? "demo" : ""}`} />
                    <span className="status-text">
                        {isConnected
                            ? "კავშირი აქტიურია"
                            : isDemoMode
                                ? "დემო რეჟიმი"
                                : wsError
                                    ? "კავშირი ვერ დამყარდა"
                                    : "კავშირის მოლოდინი..."}
                    </span>
                    {(wsError || isDemoMode) && (
                        <button
                            className="retry-button"
                            onClick={handleRetryConnection}
                            title="ხელახლა ცდა"
                        >
                            <MdRefresh />
                        </button>
                    )}
                </div>
                {isDemoMode && (
                    <div className="demo-notice">
                        სიმულაციური მონაცემები - API ხელმისაწვდომი არ არის
                    </div>
                )}
                {wsError && !isDemoMode && (
                    <div className="location-error">
                        {wsError}
                    </div>
                )}
                {locationError && (
                    <div className="location-error">
                        ლოკაცია: {locationError}
                    </div>
                )}
            </div>

            {/* Legend */}
            <div className="sferic-legend">
                <div className="legend-title">ელვის დარტყმები</div>
                <div className="legend-items">
                    <div className="legend-item">
                        <div className="legend-dot new" />
                        <span>ახალი</span>
                    </div>
                    <div className="legend-item">
                        <div className="legend-dot recent" />
                        <span>ბოლო 5 წთ</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SfericMap;
