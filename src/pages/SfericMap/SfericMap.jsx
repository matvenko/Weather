import React, { useEffect, useRef, useState, useCallback } from "react";
import { MdFlashOn, MdMyLocation, MdRefresh, MdPlayArrow, MdStop } from "react-icons/md";
import localBrandLogo from "@src/images/meteo-logo-white.png";
import "./sfericMap.css";

// WebSocket URL for Earth Networks lightning data - configurable via env
const LIGHTNING_API_KEY = import.meta.env.VITE_SFERIC_API_KEY || "8E2A3C14-B44A-41AC-A0B8-74AA1123A912";
const LIGHTNING_WS_URL = `wss://lx.wsapi.earthnetworks.com/ws/?p=${LIGHTNING_API_KEY}&f=json&t=pulse&l=all&k=on`;

// Radar API configuration
const SUBSCRIPTION_KEY = import.meta.env.VITE_EARTH_NETWORKS_SUBSCRIPTION_KEY;
const RADAR_METADATA_URL = SUBSCRIPTION_KEY
    ? `https://earthnetworks.azure-api.net/maps/overlays/v2/metadata?lid=pulserad&subscription-key=${SUBSCRIPTION_KEY}`
    : null;
const RADAR_TILE_URL = SUBSCRIPTION_KEY
    ? `https://earthnetworks.azure-api.net/maps/overlays/tile?x={x}&y={y}&z={z}&t={t}&lid=pulserad&epsg=3857&subscription-key=${SUBSCRIPTION_KEY}`
    : null;

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
    const userLocationRef = useRef(null);
    const mapInitializedRef = useRef(false);
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
    // Alert level: 'normal' (blue), 'warning' (yellow), 'danger' (red)
    const [alertLevel, setAlertLevel] = useState('normal');
    const lastRadiusStrikeRef = useRef(null);
    const alertResetTimerRef = useRef(null);

    // Radar layer state
    const [radarEnabled, setRadarEnabled] = useState(true);
    const [radarOpacity, setRadarOpacity] = useState(0.7);
    const [currentTimeSlot, setCurrentTimeSlot] = useState(null);
    const radarUpdateIntervalRef = useRef(null);

    // Keep userLocationRef in sync
    useEffect(() => {
        userLocationRef.current = userLocation;
    }, [userLocation]);

    // Update radius circle color based on alert level
    useEffect(() => {
        if (!mapRef.current) return;

        const map = mapRef.current;

        // Check if the layer exists
        if (!map.getLayer('radius-circle-fill')) return;

        // Define colors for each alert level
        const colors = {
            normal: '#4fc3f7',   // Light blue
            warning: '#ffeb3b',  // Light yellow
            danger: '#ff5252'    // Light red
        };

        const strokeColors = {
            normal: '#4fc3f7',
            warning: '#ffc107',
            danger: '#f44336'
        };

        const color = colors[alertLevel] || colors.normal;
        const strokeColor = strokeColors[alertLevel] || strokeColors.normal;

        // Update fill color
        map.setPaintProperty('radius-circle-fill', 'fill-color', color);
        map.setPaintProperty('radius-circle-fill', 'fill-opacity', alertLevel === 'normal' ? 0.1 : 0.2);

        // Update stroke color
        map.setPaintProperty('radius-circle-stroke', 'line-color', strokeColor);

    }, [alertLevel]);

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
        if (!mapRef.current || !window.mapboxgl) return;

        // Create marker element with inline styles to ensure proper rendering
        const el = document.createElement("div");
        el.style.width = "16px";
        el.style.height = "16px";
        el.style.background = "#ffeb3b";
        el.style.borderRadius = "50%";
        el.style.boxShadow = "0 0 15px #ffeb3b, 0 0 30px #ff9800";
        el.style.pointerEvents = "none";

        // Create marker with center anchor
        const marker = new window.mapboxgl.Marker({
            element: el,
            anchor: 'center'
        })
            .setLngLat([lng, lat])
            .addTo(mapRef.current);

        // Apply animation class after marker is added
        el.className = "lightning-marker";

        // Store marker with timestamp
        markersRef.current.push({
            marker,
            timestamp: Date.now(),
            data,
        });

        // Check if strike is within radius of user location (use ref to avoid dependency)
        let isInRadius = false;
        if (userLocationRef.current) {
            const distance = calculateDistance(userLocationRef.current.lat, userLocationRef.current.lng, lat, lng);
            isInRadius = distance <= RADIUS_KM;
        }

        // Update alert level if strike is in radius
        if (isInRadius) {
            const now = Date.now();
            const fiveMinutesAgo = now - 5 * 60 * 1000;

            // Check if there was a previous strike in the last 5 minutes
            if (lastRadiusStrikeRef.current && lastRadiusStrikeRef.current > fiveMinutesAgo) {
                // Second or more strike within 5 minutes - danger (red)
                setAlertLevel('danger');
            } else {
                // First strike - warning (yellow)
                setAlertLevel('warning');
            }

            lastRadiusStrikeRef.current = now;

            // Clear existing reset timer
            if (alertResetTimerRef.current) {
                clearTimeout(alertResetTimerRef.current);
            }

            // Reset to normal after 5 minutes of no strikes in radius
            alertResetTimerRef.current = setTimeout(() => {
                setAlertLevel('normal');
                lastRadiusStrikeRef.current = null;
            }, 5 * 60 * 1000);
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
    }, [calculateDistance]);

    // Lightning crack sound
    const playThunderSound = useCallback(() => {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const now = audioContext.currentTime;

            // Sharp initial CRACK
            const crack = audioContext.createOscillator();
            const crackGain = audioContext.createGain();
            crack.type = 'square';
            crack.frequency.setValueAtTime(150, now);
            crackGain.gain.setValueAtTime(0.5, now);
            crackGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
            crack.connect(crackGain);
            crackGain.connect(audioContext.destination);
            crack.start(now);
            crack.stop(now + 0.03);

            // Quick noise burst
            const bufferSize = audioContext.sampleRate * 0.15;
            const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.1));
            }

            const noise = audioContext.createBufferSource();
            noise.buffer = buffer;

            const noiseGain = audioContext.createGain();
            noiseGain.gain.setValueAtTime(0.25, now);

            noise.connect(noiseGain);
            noiseGain.connect(audioContext.destination);
            noise.start(now);

        } catch (e) {
            // Audio not supported
        }
    }, []);

    // Start demo mode - simulate lightning strikes around user location
    const startDemoMode = useCallback(() => {
        if (demoIntervalRef.current) return;

        setIsDemoMode(true);
        console.log("Starting demo mode - simulating lightning strikes");

        // Generate random lightning every 3-6 seconds
        const generateStrike = () => {
            if (!mapRef.current) return;

            // Get current map center or user location
            let centerLat, centerLng;
            if (userLocationRef.current) {
                centerLat = userLocationRef.current.lat;
                centerLng = userLocationRef.current.lng;
            } else {
                const center = mapRef.current.getCenter();
                centerLat = center.lat;
                centerLng = center.lng;
            }

            // Generate strike within 50km radius of center (wider for visibility)
            const radiusKm = 50;
            const randomAngle = Math.random() * 2 * Math.PI;
            const randomRadius = Math.random() * radiusKm;

            // Convert km to degrees (approximate)
            const latOffset = (randomRadius * Math.cos(randomAngle)) / 110.574;
            const lngOffset = (randomRadius * Math.sin(randomAngle)) / (111.32 * Math.cos(centerLat * Math.PI / 180));

            const lat = centerLat + latOffset;
            const lng = centerLng + lngOffset;

            addLightningMarker(lng, lat, { demo: true });

            // Play electric zap sound
            playThunderSound();
        };

        // Initial strikes
        for (let i = 0; i < 3; i++) {
            setTimeout(generateStrike, i * 800);
        }

        // Continuous generation
        const scheduleNextStrike = () => {
            const delay = 3000 + Math.random() * 3000;
            demoIntervalRef.current = setTimeout(() => {
                generateStrike();
                // Sometimes generate multiple strikes in quick succession (storm simulation)
                if (Math.random() > 0.7) {
                    setTimeout(generateStrike, 300);
                }
                scheduleNextStrike();
            }, delay);
        };

        scheduleNextStrike();
    }, [addLightningMarker, playThunderSound]);

    // Stop demo mode
    const stopDemoMode = useCallback(() => {
        if (demoIntervalRef.current) {
            clearTimeout(demoIntervalRef.current);
            demoIntervalRef.current = null;
        }
        setIsDemoMode(false);
    }, []);

    // Fetch latest radar time slot from metadata API
    const fetchRadarMetadata = useCallback(async () => {
        if (!RADAR_METADATA_URL) {
            console.warn('No subscription key provided for radar data');
            return null;
        }

        try {
            const response = await fetch(RADAR_METADATA_URL);
            const data = await response.json();

            if (data.Code === 200 && data.Result) {
                const latestSlot = data.Result.PreferredSlot || data.Result.LatestSlot;
                console.log('📡 Radar metadata fetched. Latest slot:', latestSlot);
                return latestSlot;
            }
        } catch (error) {
            console.error('Error fetching radar metadata:', error);
        }
        return null;
    }, []);

    // Add or update radar tile layer on map
    const updateRadarLayer = useCallback((map, timeSlot) => {
        if (!map || !timeSlot || !RADAR_TILE_URL) return;

        const sourceId = 'pulserad-source';
        const layerId = 'pulserad-layer';

        // Remove existing layer and source if present
        if (map.getLayer(layerId)) {
            map.removeLayer(layerId);
        }
        if (map.getSource(sourceId)) {
            map.removeSource(sourceId);
        }

        // Add radar tile source
        map.addSource(sourceId, {
            type: 'raster',
            tiles: [
                RADAR_TILE_URL.replace('{t}', timeSlot)
            ],
            tileSize: 256,
            attribution: 'Earth Networks PulseRad'
        });

        // Add radar layer (below any existing layers to keep lightning on top)
        map.addLayer({
            id: layerId,
            type: 'raster',
            source: sourceId,
            paint: {
                'raster-opacity': radarOpacity,
                'raster-fade-duration': 300
            }
        }, map.getLayer('radius-circle-fill') ? 'radius-circle-fill' : undefined);

        console.log('✅ Radar layer added with time slot:', timeSlot, new Date(timeSlot * 1000));
    }, [radarOpacity]);

    // Toggle radar layer visibility
    const toggleRadar = useCallback(() => {
        const map = mapRef.current;
        if (!map) return;

        const layerId = 'pulserad-layer';
        if (map.getLayer(layerId)) {
            const visibility = map.getLayoutProperty(layerId, 'visibility');
            map.setLayoutProperty(
                layerId,
                'visibility',
                visibility === 'visible' ? 'none' : 'visible'
            );
            setRadarEnabled(visibility !== 'visible');
        }
    }, []);

    // Update radar opacity
    const updateRadarOpacity = useCallback((opacity) => {
        const map = mapRef.current;
        if (!map) return;

        const layerId = 'pulserad-layer';
        if (map.getLayer(layerId)) {
            map.setPaintProperty(layerId, 'raster-opacity', opacity);
            setRadarOpacity(opacity);
        }
    }, []);

    // Start periodic radar updates (every 5 minutes)
    const startRadarUpdates = useCallback(() => {
        if (!RADAR_METADATA_URL) return;

        // Initial update
        fetchRadarMetadata().then(timeSlot => {
            if (timeSlot) {
                setCurrentTimeSlot(timeSlot);
                if (mapRef.current) {
                    updateRadarLayer(mapRef.current, timeSlot);
                }
            }
        });

        // Update every 5 minutes (300 seconds as per API docs)
        radarUpdateIntervalRef.current = setInterval(async () => {
            const timeSlot = await fetchRadarMetadata();
            if (timeSlot) {
                setCurrentTimeSlot(timeSlot);
                if (mapRef.current) {
                    updateRadarLayer(mapRef.current, timeSlot);
                }
            }
        }, 300000); // 5 minutes
    }, [fetchRadarMetadata, updateRadarLayer]);

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

    // Initialize map - only once
    useEffect(() => {
        // Skip if already initialized
        if (mapInitializedRef.current) return;
        mapInitializedRef.current = true;

        let destroyed = false;

        async function initMap() {
            try {
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

                // Start radar updates if subscription key is available
                if (SUBSCRIPTION_KEY) {
                    startRadarUpdates();
                } else {
                    console.warn('⚠️ No subscription key found. Radar overlay disabled.');
                }

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
            } catch (error) {
                console.error("Map initialization error:", error);
                setIsLoading(false);
            }
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

            if (radarUpdateIntervalRef.current) {
                clearInterval(radarUpdateIntervalRef.current);
                radarUpdateIntervalRef.current = null;
            }
            if (demoIntervalRef.current) {
                clearTimeout(demoIntervalRef.current);
                demoIntervalRef.current = null;
            }
            if (alertResetTimerRef.current) {
                clearTimeout(alertResetTimerRef.current);
                alertResetTimerRef.current = null;
            }
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
            }
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
            // Reset initialization flag for potential remount
            mapInitializedRef.current = false;
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    // Toggle demo mode handler
    const handleToggleDemo = useCallback(() => {
        if (isDemoMode) {
            stopDemoMode();
        } else {
            startDemoMode();
        }
    }, [isDemoMode, startDemoMode, stopDemoMode]);

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
                        სიმულაციური მონაცემები
                    </div>
                )}
                {/* Demo mode toggle button */}
                <button
                    className={`demo-toggle-button ${isDemoMode ? "active" : ""}`}
                    onClick={handleToggleDemo}
                    title={isDemoMode ? "დემო გამორთვა" : "დემო ჩართვა"}
                >
                    {isDemoMode ? <MdStop /> : <MdPlayArrow />}
                    <span>{isDemoMode ? "დემო გამორთვა" : "დემო ჩართვა"}</span>
                </button>

                {/* Radar Controls */}
                {SUBSCRIPTION_KEY && (
                    <>
                        <div style={{margin: '15px 0', borderTop: '1px solid rgba(255,255,255,0.2)'}} />

                        <div className="radar-controls">
                            <h4 style={{fontSize: '14px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                                📡 რადარი (PulseRad)
                            </h4>

                            <button
                                onClick={toggleRadar}
                                className="demo-toggle-button"
                                style={{
                                    background: radarEnabled ? '#4CAF50' : '#666',
                                    marginBottom: '10px'
                                }}
                            >
                                {radarEnabled ? '✓ რადარი ჩართულია' : '✗ რადარი გამორთულია'}
                            </button>

                            {radarEnabled && (
                                <div className="opacity-control" style={{marginBottom: '10px'}}>
                                    <label style={{fontSize: '12px', display: 'block', marginBottom: '5px'}}>
                                        გამჭვირვალობა: {Math.round(radarOpacity * 100)}%
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                        value={radarOpacity}
                                        onChange={(e) => updateRadarOpacity(parseFloat(e.target.value))}
                                        style={{width: '100%'}}
                                    />
                                </div>
                            )}

                            {currentTimeSlot && (
                                <div style={{fontSize: '11px', opacity: 0.7}}>
                                    ბოლო განახლება: {new Date(currentTimeSlot * 1000).toLocaleTimeString('ka-GE')}
                                </div>
                            )}
                        </div>
                    </>
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

                {/* Radar Legend */}
                {SUBSCRIPTION_KEY && radarEnabled && (
                    <>
                        <div style={{marginTop: '15px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.3)'}}>
                            <div className="legend-title">რადარი (ნალექი)</div>
                        </div>
                        <div style={{fontSize: '11px', marginTop: '8px'}}>
                            <div style={{display: 'flex', alignItems: 'center', marginBottom: '4px'}}>
                                <div style={{width: '20px', height: '12px', background: '#4444FF', marginRight: '8px', border: '1px solid rgba(255,255,255,0.3)'}}></div>
                                <span>სუსტი</span>
                            </div>
                            <div style={{display: 'flex', alignItems: 'center', marginBottom: '4px'}}>
                                <div style={{width: '20px', height: '12px', background: '#00FF00', marginRight: '8px', border: '1px solid rgba(255,255,255,0.3)'}}></div>
                                <span>ზომიერი</span>
                            </div>
                            <div style={{display: 'flex', alignItems: 'center', marginBottom: '4px'}}>
                                <div style={{width: '20px', height: '12px', background: '#FFFF00', marginRight: '8px', border: '1px solid rgba(255,255,255,0.3)'}}></div>
                                <span>ძლიერი</span>
                            </div>
                            <div style={{display: 'flex', alignItems: 'center', marginBottom: '4px'}}>
                                <div style={{width: '20px', height: '12px', background: '#FF6600', marginRight: '8px', border: '1px solid rgba(255,255,255,0.3)'}}></div>
                                <span>ძალიან ძლიერი</span>
                            </div>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <div style={{width: '20px', height: '12px', background: '#FF0000', marginRight: '8px', border: '1px solid rgba(255,255,255,0.3)'}}></div>
                                <span>უკიდურესი</span>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SfericMap;
