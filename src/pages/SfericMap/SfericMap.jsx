import React, { useEffect, useRef, useState, useCallback } from "react";
import { MdFlashOn, MdMyLocation, MdRefresh, MdPlayArrow, MdStop, MdExpandMore, MdExpandLess } from "react-icons/md";
import localBrandLogo from "@src/images/meteo-logo-white.png";
import privateAxios from "@src/api/privateAxios";
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

// Lightning Flash Tile Layer configuration (from p3.pdf)
const LIGHTNING_FLASH_METADATA_URL = SUBSCRIPTION_KEY
    ? `https://earthnetworks.azure-api.net/maps/overlays/v2/metadata?lid=lxflash-consumer&subscription-key=${SUBSCRIPTION_KEY}`
    : null;
const LIGHTNING_FLASH_TILE_URL = SUBSCRIPTION_KEY
    ? `https://earthnetworks.azure-api.net/maps/overlays/tile?x={x}&y={y}&z={z}&t={t}&lid=lxflash-consumer&epsg=3857&subscription-key=${SUBSCRIPTION_KEY}`
    : null;

// OpenWeatherMap Cloud Layer
// Note: Free API keys may take 1-2 hours to activate
// Get your API key from: https://openweathermap.org/api
const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const CLOUDS_TILE_URL = OPENWEATHER_API_KEY && OPENWEATHER_API_KEY !== 'your-api-key-here'
    ? `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`
    : null;

// NASA GIBS Satellite Imagery (free, no API key needed)
const NASA_SATELLITE_URL = 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/2024-12-06/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg';

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
        },
        // Labels layer - city names, roads, boundaries
        labels: {
            type: "raster",
            tiles: [
                "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
            ],
            tileSize: 256,
            attribution: "&copy; Esri"
        },
        // Transportation layer - roads, highways (creates line work)
        transportation: {
            type: "raster",
            tiles: [
                "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}"
            ],
            tileSize: 256,
            attribution: "&copy; Esri"
        }
    },
    layers: [
        {
            id: "osm",
            type: "raster",
            source: "osm",
            minzoom: 0,
            maxzoom: 19,
            layout: {
                visibility: "none" // Hidden by default
            }
        },
        {
            id: "satellite",
            type: "raster",
            source: "satellite",
            minzoom: 0,
            maxzoom: 19
        },
        {
            id: "transportation",
            type: "raster",
            source: "transportation",
            minzoom: 0,
            maxzoom: 19
        },
        {
            id: "labels",
            type: "raster",
            source: "labels",
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
    const [showContours, setShowContours] = useState(false); // Contour effect toggle

    // Lightning Flash tile layer state (from p3.pdf)
    const [lightningFlashEnabled, setLightningFlashEnabled] = useState(false); // Off by default
    const [lightningFlashOpacity, setLightningFlashOpacity] = useState(0.8);
    const [currentLightningTimeSlot, setCurrentLightningTimeSlot] = useState(null);
    const lightningFlashUpdateIntervalRef = useRef(null);

    // Cloud layer state
    const [cloudsEnabled, setCloudsEnabled] = useState(false); // Off by default
    const [cloudsOpacity, setCloudsOpacity] = useState(0.5);

    // Map style state
    const [showLabels, setShowLabels] = useState(true);
    const [mapStyle, setMapStyle] = useState('satellite'); // 'satellite' or 'streets'

    // Polygon state
    const [polygonsEnabled, setPolygonsEnabled] = useState(true);
    const [polygonsData, setPolygonsData] = useState([]);
    const polygonUpdateIntervalRef = useRef(null);

    // Collapse state for UI panels
    const [isMonitoringCollapsed, setIsMonitoringCollapsed] = useState(false);
    const [isLegendCollapsed, setIsLegendCollapsed] = useState(false);

    // Keep userLocationRef in sync
    useEffect(() => {
        userLocationRef.current = userLocation;
    }, [userLocation]);

    // Toggle labels visibility
    useEffect(() => {
        if (!mapRef.current) return;
        const map = mapRef.current;

        if (map.getLayer('labels')) {
            map.setLayoutProperty('labels', 'visibility', showLabels ? 'visible' : 'none');
        }
        if (map.getLayer('transportation')) {
            map.setLayoutProperty('transportation', 'visibility', showLabels ? 'visible' : 'none');
        }
    }, [showLabels]);

    // Toggle map style (satellite vs streets)
    useEffect(() => {
        if (!mapRef.current) return;
        const map = mapRef.current;

        if (map.getLayer('satellite')) {
            map.setLayoutProperty('satellite', 'visibility', mapStyle === 'satellite' ? 'visible' : 'none');
        }
        if (map.getLayer('osm')) {
            map.setLayoutProperty('osm', 'visibility', mapStyle === 'streets' ? 'visible' : 'none');
        }
    }, [mapStyle]);

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
                'raster-fade-duration': 300,
                // Add contour-like effect with brightness/contrast
                'raster-brightness-max': showContours ? 1.2 : 1.0,
                'raster-contrast': showContours ? 0.3 : 0
            }
        }, map.getLayer('radius-circle-fill') ? 'radius-circle-fill' : undefined);

        console.log('✅ Radar layer added with time slot:', timeSlot, new Date(timeSlot * 1000));
    }, [radarOpacity, showContours]);

    // Add or update cloud tile layer on map
    const updateCloudLayer = useCallback((map) => {
        if (!map || !CLOUDS_TILE_URL) return;

        const sourceId = 'clouds-source';
        const layerId = 'clouds-layer';

        // Remove existing layer and source if present
        if (map.getLayer(layerId)) {
            map.removeLayer(layerId);
        }
        if (map.getSource(sourceId)) {
            map.removeSource(sourceId);
        }

        // Add cloud tile source
        map.addSource(sourceId, {
            type: 'raster',
            tiles: [CLOUDS_TILE_URL],
            tileSize: 256,
            attribution: 'OpenWeatherMap'
        });

        // Add cloud layer
        map.addLayer({
            id: layerId,
            type: 'raster',
            source: sourceId,
            paint: {
                'raster-opacity': cloudsOpacity,
                'raster-fade-duration': 300
            },
            layout: {
                visibility: cloudsEnabled ? 'visible' : 'none'
            }
        }, map.getLayer('pulserad-layer') || map.getLayer('radius-circle-fill') ? undefined : undefined);

        console.log('✅ Cloud layer added');
    }, [cloudsOpacity, cloudsEnabled]);

    // Toggle cloud layer visibility
    const toggleClouds = useCallback(() => {
        const map = mapRef.current;
        if (!map) return;

        const layerId = 'clouds-layer';
        if (map.getLayer(layerId)) {
            const visibility = map.getLayoutProperty(layerId, 'visibility');
            map.setLayoutProperty(
                layerId,
                'visibility',
                visibility === 'visible' ? 'none' : 'visible'
            );
            setCloudsEnabled(visibility !== 'visible');
        }
    }, []);

    // Update cloud opacity
    const updateCloudOpacity = useCallback((opacity) => {
        const map = mapRef.current;
        if (!map) return;

        const layerId = 'clouds-layer';
        if (map.getLayer(layerId)) {
            map.setPaintProperty(layerId, 'raster-opacity', opacity);
            setCloudsOpacity(opacity);
        }
    }, []);

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

    // Fetch lightning polygons from backend API
    const fetchPolygons = useCallback(async () => {
        try {
            console.log('🔄 Fetching lightning polygons from /api/v1/weather/get-polygons...');
            const response = await privateAxios.get('/api/v1/weather/get-polygons');
            console.log('📦 Raw API response:', response.data);

            if (response.data && Array.isArray(response.data)) {
                console.log('⚡ Lightning polygons fetched:', response.data.length);

                // Log each polygon details for debugging
                response.data.forEach((polygon, index) => {
                    console.log(`Polygon ${index + 1}:`, {
                        identifier: polygon.identifier,
                        severity: polygon.severity,
                        lightning_level: polygon.lightning_level,
                        coordinateCount: polygon.polygon?.length || 0,
                        firstCoord: polygon.polygon?.[0],
                    });
                });

                setPolygonsData(response.data);
                return response.data;
            } else {
                console.warn('⚠️ API response is not an array or is empty');
            }
        } catch (error) {
            console.error('❌ Error fetching lightning polygons:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
        }
        return [];
    }, []);

    // Calculate polygon centroid
    const calculatePolygonCentroid = useCallback((coordinates) => {
        let sumLng = 0;
        let sumLat = 0;
        const numPoints = coordinates.length;

        coordinates.forEach(([lng, lat]) => {
            sumLng += lng;
            sumLat += lat;
        });

        return [sumLng / numPoints, sumLat / numPoints];
    }, []);

    // Convert mph to km/h
    // Handles both number and string formats (e.g., "12 mph" or "12" or 12)
    const mphToKmh = (mph) => {
        if (typeof mph === 'string') {
            // Extract number from strings like "12 mph"
            const match = mph.match(/[\d.]+/);
            if (match) {
                const speed = parseFloat(match[0]);
                return isNaN(speed) ? 0 : speed * 1.60934;
            }
        }
        const speed = parseFloat(mph);
        return isNaN(speed) ? 0 : speed * 1.60934;
    };

    // Calculate future position based on speed, direction, and time
    const calculateFuturePosition = useCallback((center, direction, speedMph, minutes) => {
        const speedKmh = mphToKmh(speedMph);
        const distanceKm = (speedKmh / 60) * minutes; // distance in km

        // Convert direction from degrees to radians (direction is meteorological: 0° = North, clockwise)
        const directionDeg = parseFloat(direction);
        const bearing = ((directionDeg + 180) % 360) * (Math.PI / 180); // Add 180 to get movement direction

        const [lng, lat] = center;

        // Earth's radius in km
        const R = 6371;

        // Convert to radians
        const lat1 = lat * (Math.PI / 180);
        const lng1 = lng * (Math.PI / 180);

        // Calculate new position
        const lat2 = Math.asin(
            Math.sin(lat1) * Math.cos(distanceKm / R) +
            Math.cos(lat1) * Math.sin(distanceKm / R) * Math.cos(bearing)
        );

        const lng2 = lng1 + Math.atan2(
            Math.sin(bearing) * Math.sin(distanceKm / R) * Math.cos(lat1),
            Math.cos(distanceKm / R) - Math.sin(lat1) * Math.sin(lat2)
        );

        return [lng2 * (180 / Math.PI), lat2 * (180 / Math.PI)];
    }, []);

    // Get color and opacity based on severity and lightning level
    const getPolygonStyle = useCallback((polygon) => {
        const { severity, lightning_level } = polygon;

        // Use yellow/orange colors for CELL_POLYGON (matching sf9.png reference image)
        let fillColor = '#FFD700'; // Yellow/Gold (default for Low/Unknown)
        let fillOpacity = 0.3;
        let strokeColor = '#FFA500';
        let strokeOpacity = 0.8;

        if (lightning_level === 'High' || severity === 'Severe') {
            fillColor = '#00ff00';
            fillOpacity = 0.1;
            strokeColor = '#670081'; // Orange red
        } else if (lightning_level === 'Medium' || severity === 'Moderate') {
            fillColor = '#00ff00'; // Orange
            fillOpacity = 0.1;
            strokeColor = '#FFA500'; // Dark orange
        } else {
            fillColor = '#FFD700'; // Gold
            fillOpacity = 0.1;
            strokeColor = '#00ff00'; // Orange
        }

        return { fillColor, fillOpacity, strokeColor, strokeOpacity };
    }, []);

    // Convert polygon data to GeoJSON format
    const polygonToGeoJSON = useCallback((polygonsArray) => {
        const features = polygonsArray.map((item, index) => {
            // Convert polygon coordinates from {lat, lng} to [lng, lat] format
            // with automatic detection and correction of swapped coordinates
            const coordinates = item.polygon.map((coord, coordIndex) => {
                const lat = parseFloat(coord.lat);
                const lng = parseFloat(coord.lng);

                // Auto-detect if lat/lng are swapped based on valid ranges
                // Latitude MUST be -90 to +90, Longitude MUST be -180 to +180
                const latIsInvalid = lat < -90 || lat > 90;
                const lngIsInvalid = lng < -180 || lng > 180;
                const lngAsLat = lng >= -90 && lng <= 90;

                if (latIsInvalid && lngAsLat && !lngIsInvalid) {
                    // Coordinates are swapped: lat is actually lng, lng is actually lat
                    if (coordIndex === 0) {
                        console.warn(`⚠️ Polygon ${index + 1} (${item.identifier}): Detected swapped coordinates - auto-correcting`);
                        console.warn(`   Original: lat=${lat}, lng=${lng} → Corrected: lat=${lng}, lng=${lat}`);
                    }
                    return [lat, lng];  // Use lat as longitude, lng as latitude (swapped)
                }

                // Validate coordinates even when not swapping
                if (latIsInvalid) {
                    console.error(`❌ Polygon ${index + 1}, coord ${coordIndex}: Invalid latitude ${lat} (must be -90 to +90)`);
                }
                if (lngIsInvalid) {
                    console.error(`❌ Polygon ${index + 1}, coord ${coordIndex}: Invalid longitude ${lng} (must be -180 to +180)`);
                }

                return [lng, lat];  // Normal: GeoJSON [longitude, latitude]
            });

            const style = getPolygonStyle(item);

            return {
                type: 'Feature',
                id: item.identifier || `polygon-${index}`,
                properties: {
                    identifier: item.identifier,
                    severity: item.severity,
                    lightning_level: item.lightning_level,
                    headline: item.headline,
                    description: item.description,
                    expires: item.expires,
                    fillColor: style.fillColor,
                    fillOpacity: style.fillOpacity,
                    strokeColor: style.strokeColor,
                    strokeOpacity: style.strokeOpacity
                },
                geometry: {
                    type: 'Polygon',
                    coordinates: [coordinates]
                }
            };
        });

        return {
            type: 'FeatureCollection',
            features
        };
    }, [getPolygonStyle]);

    // Get cell polygon style based on severity
    const getCellPolygonStyle = useCallback((item) => {
        const severity = item.severity || 'Unknown';

        let strokeColor, fillColor;

        // Stroke color based on severity
        switch(severity) {
            case 'Severe':
                strokeColor = '#9C27B0';  // Purple
                break;
            case 'Moderate':
                strokeColor = '#FF9800';  // Orange
                break;
            case 'Unknown':
            default:
                strokeColor = '#FFEB3B';  // Yellow
                break;
        }

        // Fill color - lighter version of stroke
        fillColor = strokeColor;

        return {
            fillColor: fillColor,
            fillOpacity: 0.15,
            strokeColor: strokeColor,
            strokeOpacity: 0.9
        };
    }, []);

    // Convert cell_polygon data to GeoJSON format (storm cell polygon)
    const cellPolygonToGeoJSON = useCallback((polygonsArray) => {
        // Filter out items without cell_polygon data
        const itemsWithCellPolygon = polygonsArray.filter(item => item.cell_polygon && item.cell_polygon.length > 0);

        const features = itemsWithCellPolygon.map((item, index) => {
            // Convert cell_polygon coordinates from {lat, lng} to [lng, lat] format
            const coordinates = item.cell_polygon.map((coord, coordIndex) => {
                const lat = parseFloat(coord.lat);
                const lng = parseFloat(coord.lng);

                // Auto-detect if lat/lng are swapped
                const latIsInvalid = lat < -90 || lat > 90;
                const lngIsInvalid = lng < -180 || lng > 180;
                const lngAsLat = lng >= -90 && lng <= 90;

                if (latIsInvalid && lngAsLat && !lngIsInvalid) {
                    if (coordIndex === 0) {
                        console.warn(`⚠️ Cell Polygon ${index + 1} (${item.identifier}): Detected swapped coordinates - auto-correcting`);
                    }
                    return [lat, lng];  // Swapped
                }

                if (latIsInvalid) {
                    console.error(`❌ Cell Polygon ${index + 1}, coord ${coordIndex}: Invalid latitude ${lat}`);
                }
                if (lngIsInvalid) {
                    console.error(`❌ Cell Polygon ${index + 1}, coord ${coordIndex}: Invalid longitude ${lng}`);
                }

                return [lng, lat];  // Normal GeoJSON format
            });

            // Get cell polygon styling based on severity
            const style = getCellPolygonStyle(item);

            return {
                type: 'Feature',
                id: `cell-${item.identifier || `polygon-${index}`}`,
                properties: {
                    identifier: item.identifier,
                    severity: item.severity,
                    lightning_level: item.lightning_level,
                    fillColor: style.fillColor,
                    fillOpacity: style.fillOpacity,
                    strokeColor: style.strokeColor,
                    strokeOpacity: style.strokeOpacity
                },
                geometry: {
                    type: 'Polygon',
                    coordinates: [coordinates]
                }
            };
        });

        return {
            type: 'FeatureCollection',
            features
        };
    }, [getCellPolygonStyle]);

    // Add or update polygon layers on map
    const updatePolygonLayers = useCallback((map, polygonsArray) => {
        console.log('🗺️ updatePolygonLayers called with:', {
            hasMap: !!map,
            polygonCount: polygonsArray?.length || 0
        });

        if (!map || !polygonsArray) {
            console.warn('⚠️ No map or polygons array provided');
            return;
        }

        const sourceId = 'lightning-polygons-source';
        const fillLayerId = 'lightning-polygons-fill';
        const strokeLayerId = 'lightning-polygons-stroke';

        // Remove existing layers if present
        if (map.getLayer(fillLayerId)) {
            console.log('🗑️ Removing existing fill layer');
            map.removeLayer(fillLayerId);
        }
        if (map.getLayer(strokeLayerId)) {
            console.log('🗑️ Removing existing stroke layer');
            map.removeLayer(strokeLayerId);
        }
        if (map.getSource(sourceId)) {
            console.log('🗑️ Removing existing source');
            map.removeSource(sourceId);
        }

        // If no polygons, just return after cleanup
        if (polygonsArray.length === 0) {
            console.log('📭 No lightning polygons to display');
            return;
        }

        // Convert to GeoJSON
        console.log('🔄 Converting polygons to GeoJSON...');
        const geojson = polygonToGeoJSON(polygonsArray);
        console.log('📐 GeoJSON created:', {
            type: geojson.type,
            featureCount: geojson.features?.length,
            firstFeature: geojson.features?.[0]
        });

        // Add polygon source
        map.addSource(sourceId, {
            type: 'geojson',
            data: geojson
        });

        // Add fill layer with data-driven styling
        map.addLayer({
            id: fillLayerId,
            type: 'fill',
            source: sourceId,
            paint: {
                'fill-color': ['get', 'fillColor'],
                'fill-opacity': ['get', 'fillOpacity']
            },
            layout: {
                visibility: polygonsEnabled ? 'visible' : 'none'
            }
        }, map.getLayer('radius-circle-fill') ? 'radius-circle-fill' : undefined);

        // Add stroke layer
        map.addLayer({
            id: strokeLayerId,
            type: 'line',
            source: sourceId,
            paint: {
                'line-color': ['get', 'strokeColor'],
                'line-width': 2,
                'line-opacity': ['get', 'strokeOpacity']
            },
            layout: {
                visibility: polygonsEnabled ? 'visible' : 'none'
            }
        }, map.getLayer('radius-circle-fill') ? 'radius-circle-fill' : undefined);

        // ========== ADD CELL POLYGON LAYERS (Storm Cell) ==========
        const cellSourceId = 'cell-polygons-source';
        const cellFillLayerId = 'cell-polygons-fill';
        const cellStrokeLayerId = 'cell-polygons-stroke';

        // Remove existing cell polygon layers if present
        if (map.getLayer(cellFillLayerId)) {
            console.log('🗑️ Removing existing cell fill layer');
            map.removeLayer(cellFillLayerId);
        }
        if (map.getLayer(cellStrokeLayerId)) {
            console.log('🗑️ Removing existing cell stroke layer');
            map.removeLayer(cellStrokeLayerId);
        }
        if (map.getSource(cellSourceId)) {
            console.log('🗑️ Removing existing cell source');
            map.removeSource(cellSourceId);
        }

        // Check if any polygons have cell_polygon data
        const hasValidCellPolygons = polygonsArray.some(p => p.cell_polygon && p.cell_polygon.length > 0);

        if (hasValidCellPolygons) {
            // Convert cell polygons to GeoJSON
            console.log('🔄 Converting cell polygons to GeoJSON...');
            const cellGeojson = cellPolygonToGeoJSON(polygonsArray);
            console.log('📐 Cell GeoJSON created:', {
                type: cellGeojson.type,
                featureCount: cellGeojson.features?.length
            });

            if (cellGeojson.features.length > 0) {
                // Add cell polygon source
                map.addSource(cellSourceId, {
                    type: 'geojson',
                    data: cellGeojson
                });

                // Add cell fill layer
                map.addLayer({
                    id: cellFillLayerId,
                    type: 'fill',
                    source: cellSourceId,
                    paint: {
                        'fill-color': ['get', 'fillColor'],
                        'fill-opacity': ['get', 'fillOpacity']
                    },
                    layout: {
                        visibility: polygonsEnabled ? 'visible' : 'none'
                    }
                }, map.getLayer('radius-circle-fill') ? 'radius-circle-fill' : undefined);

                // Add cell stroke layer
                map.addLayer({
                    id: cellStrokeLayerId,
                    type: 'line',
                    source: cellSourceId,
                    paint: {
                        'line-color': ['get', 'strokeColor'],
                        'line-width': 2,
                        'line-opacity': ['get', 'strokeOpacity']
                    },
                    layout: {
                        visibility: polygonsEnabled ? 'visible' : 'none'
                    }
                }, map.getLayer('radius-circle-fill') ? 'radius-circle-fill' : undefined);

                // Add click handler for cell polygons
                map.on('click', cellFillLayerId, (e) => {
                    if (e.features && e.features.length > 0) {
                        const properties = e.features[0].properties;
                        const popup = new window.mapboxgl.Popup()
                            .setLngLat(e.lngLat)
                            .setHTML(`
                                <div style="color: #000; padding: 5px;">
                                    <h4 style="margin: 0 0 5px 0; font-size: 14px; color: #9C27B0;">⚡ Storm Cell</h4>
                                    <p style="margin: 5px 0; font-size: 12px;"><strong>ID:</strong> ${properties.identifier || 'N/A'}</p>
                                    <p style="margin: 5px 0; font-size: 12px;"><strong>Level:</strong> ${properties.lightning_level || 'Unknown'}</p>
                                    <p style="margin: 5px 0; font-size: 11px; color: #666;">This is the core storm cell area</p>
                                </div>
                            `)
                            .addTo(map);
                    }
                });

                // Change cursor on hover
                map.on('mouseenter', cellFillLayerId, () => {
                    map.getCanvas().style.cursor = 'pointer';
                });
                map.on('mouseleave', cellFillLayerId, () => {
                    map.getCanvas().style.cursor = '';
                });

                console.log(`✅ Cell polygons successfully added to map! Count: ${cellGeojson.features.length}`);
            }
        } else {
            console.log('📭 No cell polygons to display');
        }

        // Add click handler for polygons to show info
        map.on('click', fillLayerId, (e) => {
            if (e.features && e.features.length > 0) {
                const properties = e.features[0].properties;
                const popup = new window.mapboxgl.Popup()
                    .setLngLat(e.lngLat)
                    .setHTML(`
                        <div style="color: #000; padding: 5px;">
                            <h4 style="margin: 0 0 5px 0; font-size: 14px;">${properties.headline || 'Lightning Alert'}</h4>
                            <p style="margin: 5px 0; font-size: 12px;"><strong>Level:</strong> ${properties.lightning_level || 'Unknown'}</p>
                            <p style="margin: 5px 0; font-size: 12px;"><strong>Severity:</strong> ${properties.severity || 'Unknown'}</p>
                            <p style="margin: 5px 0; font-size: 11px;">${properties.description ? properties.description.substring(0, 150) + '...' : ''}</p>
                            ${properties.expires ? `<p style="margin: 5px 0; font-size: 11px;"><strong>Expires:</strong> ${new Date(properties.expires).toLocaleString('ka-GE')}</p>` : ''}
                        </div>
                    `)
                    .addTo(map);
            }
        });

        // Change cursor on hover
        map.on('mouseenter', fillLayerId, () => {
            map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', fillLayerId, () => {
            map.getCanvas().style.cursor = '';
        });

        // Add direction arrows and forecast paths for polygons with direction/speed data
        const directionArrows = [];
        const arrowheads = [];  // Arrowheads at the end of direction lines
        const forecastCircles = [];
        const stormCenters = [];

        polygonsArray.forEach((polygon, index) => {
            if (polygon.direction && polygon.speed) {
                // Get polygon coordinates (already swapped if needed)
                const coords = polygon.polygon.map((coord, coordIndex) => {
                    const lat = parseFloat(coord.lat);
                    const lng = parseFloat(coord.lng);
                    const latIsInvalid = lat < -90 || lat > 90;
                    const lngAsLat = lng >= -90 && lng <= 90;
                    const lngIsInvalid = lng < -180 || lng > 180;

                    if (latIsInvalid && lngAsLat && !lngIsInvalid) {
                        return [lat, lng]; // swapped
                    }
                    return [lng, lat]; // normal
                });

                // Calculate centroid
                const center = calculatePolygonCentroid(coords);

                // Add storm center marker
                stormCenters.push({
                    type: 'Feature',
                    id: `storm-center-${index}`,
                    properties: {
                        identifier: polygon.identifier,
                        speed: polygon.speed,
                        direction: polygon.direction
                    },
                    geometry: {
                        type: 'Point',
                        coordinates: center
                    }
                });

                // Calculate arrow end point (60 minutes in direction)
                const arrowEnd = calculateFuturePosition(center, polygon.direction, polygon.speed, 60);

                directionArrows.push({
                    type: 'Feature',
                    id: `arrow-${index}`,
                    properties: {
                        identifier: polygon.identifier,
                        speed: polygon.speed,
                        direction: polygon.direction
                    },
                    geometry: {
                        type: 'LineString',
                        coordinates: [center, arrowEnd]
                    }
                });

                // Create arrowhead triangle at the end
                // Triangle pointing in direction of movement
                const directionRad = (parseFloat(polygon.direction) + 180) * (Math.PI / 180);
                const arrowSize = 0.02; // Size in degrees (~2km)

                // Three points of the triangle
                const tipAngle = directionRad;
                const leftAngle = directionRad + (2.5 * Math.PI / 3);  // 150 degrees left
                const rightAngle = directionRad - (2.5 * Math.PI / 3); // 150 degrees right

                const tip = arrowEnd;
                const left = [
                    arrowEnd[0] + arrowSize * Math.sin(leftAngle),
                    arrowEnd[1] + arrowSize * Math.cos(leftAngle)
                ];
                const right = [
                    arrowEnd[0] + arrowSize * Math.sin(rightAngle),
                    arrowEnd[1] + arrowSize * Math.cos(rightAngle)
                ];

                arrowheads.push({
                    type: 'Feature',
                    id: `arrowhead-${index}`,
                    properties: {
                        identifier: polygon.identifier
                    },
                    geometry: {
                        type: 'Polygon',
                        coordinates: [[tip, left, right, tip]]
                    }
                });

                // Forecast circles removed per user request
                // [15, 30, 45].forEach((minutes, minuteIndex) => {
                //     const forecastPos = calculateFuturePosition(center, polygon.direction, polygon.speed, minutes);
                //     const radiusKm = 8 + (minuteIndex * 3); // Larger circles: 8km, 11km, 14km
                //
                //     forecastCircles.push({
                //         type: 'Feature',
                //         id: `forecast-${index}-${minutes}min`,
                //         properties: {
                //             identifier: polygon.identifier,
                //             minutes: minutes,
                //             radiusKm: radiusKm
                //         },
                //         geometry: {
                //             type: 'Point',
                //             coordinates: forecastPos
                //         }
                //     });
                // });
            }
        });

        // Add direction arrow layers
        if (directionArrows.length > 0) {
            const arrowSourceId = 'direction-arrows-source';
            const arrowLayerId = 'direction-arrows-layer';

            if (map.getLayer(arrowLayerId)) map.removeLayer(arrowLayerId);
            if (map.getSource(arrowSourceId)) map.removeSource(arrowSourceId);

            map.addSource(arrowSourceId, {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: directionArrows
                }
            });

            map.addLayer({
                id: arrowLayerId,
                type: 'line',
                source: arrowSourceId,
                paint: {
                    'line-color': '#00CED1', // Cyan/turquoise arrows (matching sf7.png)
                    'line-width': 4,
                    'line-opacity': 1.0
                },
                layout: {
                    visibility: polygonsEnabled ? 'visible' : 'none',
                    'line-cap': 'round'
                }
            });

            console.log(`➡️ Added ${directionArrows.length} direction arrows`);
        }

        // Add arrowhead layer
        if (arrowheads.length > 0) {
            const arrowheadSourceId = 'arrowheads-source';
            const arrowheadLayerId = 'arrowheads-layer';

            if (map.getLayer(arrowheadLayerId)) map.removeLayer(arrowheadLayerId);
            if (map.getSource(arrowheadSourceId)) map.removeSource(arrowheadSourceId);

            map.addSource(arrowheadSourceId, {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: arrowheads
                }
            });

            map.addLayer({
                id: arrowheadLayerId,
                type: 'fill',
                source: arrowheadSourceId,
                paint: {
                    'fill-color': '#00CED1', // Cyan/turquoise (matching arrow)
                    'fill-opacity': 1.0
                },
                layout: {
                    visibility: polygonsEnabled ? 'visible' : 'none'
                }
            });

            console.log(`🔺 Added ${arrowheads.length} arrowheads`);
        }

        // Add storm center markers
        if (stormCenters.length > 0) {
            const centerSourceId = 'storm-centers-source';
            const centerLayerId = 'storm-centers-layer';

            if (map.getLayer(centerLayerId)) map.removeLayer(centerLayerId);
            if (map.getSource(centerSourceId)) map.removeSource(centerSourceId);

            map.addSource(centerSourceId, {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: stormCenters
                }
            });

            map.addLayer({
                id: centerLayerId,
                type: 'circle',
                source: centerSourceId,
                paint: {
                    'circle-radius': 6,
                    'circle-color': '#00CED1', // Cyan/turquoise
                    'circle-stroke-width': 2,
                    'circle-stroke-color': '#FFFFFF',
                    'circle-opacity': 0.9
                },
                layout: {
                    visibility: polygonsEnabled ? 'visible' : 'none'
                }
            });

            console.log(`🎯 Added ${stormCenters.length} storm center markers`);
        }

        // Add direction arrows for CELL POLYGONS (storm cells)
        const cellDirectionArrows = [];
        const cellArrowheads = [];
        const cellStormCenters = [];

        polygonsArray.forEach((polygon, index) => {
            // Only process if cell_polygon exists and has direction/speed data
            if (polygon.cell_polygon && polygon.cell_polygon.length > 0 && polygon.direction && polygon.speed) {
                // Get cell polygon coordinates (handle coordinate swapping)
                const cellCoords = polygon.cell_polygon.map((coord) => {
                    const lat = parseFloat(coord.lat);
                    const lng = parseFloat(coord.lng);
                    const latIsInvalid = lat < -90 || lat > 90;
                    const lngAsLat = lng >= -90 && lng <= 90;
                    const lngIsInvalid = lng < -180 || lng > 180;

                    if (latIsInvalid && lngAsLat && !lngIsInvalid) {
                        return [lat, lng]; // swapped
                    }
                    return [lng, lat]; // normal
                });

                // Calculate cell polygon centroid
                const cellCenter = calculatePolygonCentroid(cellCoords);

                // Add cell storm center marker
                cellStormCenters.push({
                    type: 'Feature',
                    id: `cell-storm-center-${index}`,
                    properties: {
                        identifier: polygon.identifier,
                        speed: polygon.speed,
                        direction: polygon.direction,
                        severity: polygon.severity
                    },
                    geometry: {
                        type: 'Point',
                        coordinates: cellCenter
                    }
                });

                // Calculate arrow end point (60 minutes in direction)
                const cellArrowEnd = calculateFuturePosition(cellCenter, polygon.direction, polygon.speed, 60);

                cellDirectionArrows.push({
                    type: 'Feature',
                    id: `cell-arrow-${index}`,
                    properties: {
                        identifier: polygon.identifier,
                        speed: polygon.speed,
                        direction: polygon.direction,
                        severity: polygon.severity
                    },
                    geometry: {
                        type: 'LineString',
                        coordinates: [cellCenter, cellArrowEnd]
                    }
                });

                // Create arrowhead triangle at the end
                const directionRad = (parseFloat(polygon.direction) + 180) * (Math.PI / 180);
                const arrowSize = 0.02; // Size in degrees (~2km)

                // Three points of the triangle
                const tipAngle = directionRad;
                const leftAngle = directionRad + (2.5 * Math.PI / 3);  // 150 degrees left
                const rightAngle = directionRad - (2.5 * Math.PI / 3); // 150 degrees right

                const tip = cellArrowEnd;
                const left = [
                    cellArrowEnd[0] + arrowSize * Math.sin(leftAngle),
                    cellArrowEnd[1] + arrowSize * Math.cos(leftAngle)
                ];
                const right = [
                    cellArrowEnd[0] + arrowSize * Math.sin(rightAngle),
                    cellArrowEnd[1] + arrowSize * Math.cos(rightAngle)
                ];

                cellArrowheads.push({
                    type: 'Feature',
                    id: `cell-arrowhead-${index}`,
                    properties: {
                        identifier: polygon.identifier,
                        severity: polygon.severity
                    },
                    geometry: {
                        type: 'Polygon',
                        coordinates: [[tip, left, right, tip]]
                    }
                });
            }
        });

        // Add cell direction arrow layers
        if (cellDirectionArrows.length > 0) {
            const cellArrowSourceId = 'cell-direction-arrows-source';
            const cellArrowLayerId = 'cell-direction-arrows-layer';

            if (map.getLayer(cellArrowLayerId)) map.removeLayer(cellArrowLayerId);
            if (map.getSource(cellArrowSourceId)) map.removeSource(cellArrowSourceId);

            map.addSource(cellArrowSourceId, {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: cellDirectionArrows
                }
            });

            map.addLayer({
                id: cellArrowLayerId,
                type: 'line',
                source: cellArrowSourceId,
                paint: {
                    'line-color': '#FF1493', // Deep pink for cell arrows (distinct from cyan alert arrows)
                    'line-width': 4,
                    'line-opacity': 1.0
                },
                layout: {
                    visibility: polygonsEnabled ? 'visible' : 'none',
                    'line-cap': 'round'
                }
            });

            console.log(`➡️ Added ${cellDirectionArrows.length} cell direction arrows`);
        }

        // Add cell arrowhead layer
        if (cellArrowheads.length > 0) {
            const cellArrowheadSourceId = 'cell-arrowheads-source';
            const cellArrowheadLayerId = 'cell-arrowheads-layer';

            if (map.getLayer(cellArrowheadLayerId)) map.removeLayer(cellArrowheadLayerId);
            if (map.getSource(cellArrowheadSourceId)) map.removeSource(cellArrowheadSourceId);

            map.addSource(cellArrowheadSourceId, {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: cellArrowheads
                }
            });

            map.addLayer({
                id: cellArrowheadLayerId,
                type: 'fill',
                source: cellArrowheadSourceId,
                paint: {
                    'fill-color': '#FF1493', // Deep pink (matching cell arrow)
                    'fill-opacity': 1.0
                },
                layout: {
                    visibility: polygonsEnabled ? 'visible' : 'none'
                }
            });

            console.log(`🔺 Added ${cellArrowheads.length} cell arrowheads`);
        }

        // Add cell storm center markers
        if (cellStormCenters.length > 0) {
            const cellCenterSourceId = 'cell-storm-centers-source';
            const cellCenterLayerId = 'cell-storm-centers-layer';

            if (map.getLayer(cellCenterLayerId)) map.removeLayer(cellCenterLayerId);
            if (map.getSource(cellCenterSourceId)) map.removeSource(cellCenterSourceId);

            map.addSource(cellCenterSourceId, {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: cellStormCenters
                }
            });

            map.addLayer({
                id: cellCenterLayerId,
                type: 'circle',
                source: cellCenterSourceId,
                paint: {
                    'circle-radius': 6,
                    'circle-color': '#FF1493', // Deep pink
                    'circle-stroke-width': 2,
                    'circle-stroke-color': '#FFFFFF',
                    'circle-opacity': 0.9
                },
                layout: {
                    visibility: polygonsEnabled ? 'visible' : 'none'
                }
            });

            console.log(`🎯 Added ${cellStormCenters.length} cell storm center markers`);
        }

        // Forecast circle layers removed per user request
        // if (forecastCircles.length > 0) {
        //     const forecastSourceId = 'forecast-circles-source';
        //     const forecastLayerId = 'forecast-circles-layer';
        //
        //     if (map.getLayer(forecastLayerId)) map.removeLayer(forecastLayerId);
        //     if (map.getSource(forecastSourceId)) map.removeSource(forecastSourceId);
        //
        //     map.addSource(forecastSourceId, {
        //         type: 'geojson',
        //         data: {
        //             type: 'FeatureCollection',
        //             features: forecastCircles
        //         }
        //     });
        //
        //     map.addLayer({
        //         id: forecastLayerId,
        //         type: 'circle',
        //         source: forecastSourceId,
        //         paint: {
        //             // Much larger circles that scale with zoom (8-14km circles)
        //             'circle-radius': [
        //                 'interpolate',
        //                 ['linear'],
        //                 ['zoom'],
        //                 4, ['*', ['get', 'radiusKm'], 1],      // zoom 4: 1x
        //                 6, ['*', ['get', 'radiusKm'], 3],      // zoom 6: 3x
        //                 8, ['*', ['get', 'radiusKm'], 6],      // zoom 8: 6x
        //                 10, ['*', ['get', 'radiusKm'], 10],    // zoom 10: 10x
        //                 12, ['*', ['get', 'radiusKm'], 16]     // zoom 12: 16x (very large)
        //             ],
        //             'circle-color': '#00FF00',               // Green fill
        //             'circle-opacity': 0.02,                  // Nearly transparent fill
        //             'circle-stroke-width': 3,                // Visible stroke
        //             'circle-stroke-color': '#00FF00',        // Green stroke
        //             'circle-stroke-opacity': 0.9             // Strong visible stroke
        //         },
        //         layout: {
        //             visibility: polygonsEnabled ? 'visible' : 'none'
        //         }
        //     });
        //
        //     console.log(`⭕ Added ${forecastCircles.length} forecast circles`);
        // }

        console.log('✅ Lightning polygons successfully added to map!', {
            polygonCount: polygonsArray.length,
            layersCreated: [fillLayerId, strokeLayerId],
            sourceId: sourceId,
            visibility: polygonsEnabled ? 'visible' : 'none',
            mapBounds: map.getBounds().toArray()
        });
    }, [polygonToGeoJSON, cellPolygonToGeoJSON, polygonsEnabled, calculatePolygonCentroid, calculateFuturePosition]);

    // Toggle polygon visibility
    const togglePolygons = useCallback(() => {
        const map = mapRef.current;
        if (!map) return;

        const layers = [
            'lightning-polygons-fill',
            'lightning-polygons-stroke',
            'cell-polygons-fill',
            'cell-polygons-stroke',
            'direction-arrows-layer',
            'arrowheads-layer',
            'storm-centers-layer',
            'cell-direction-arrows-layer',  // Cell polygon direction arrows
            'cell-arrowheads-layer',
            'cell-storm-centers-layer'
        ];

        const fillLayerId = layers[0];

        if (map.getLayer(fillLayerId)) {
            const visibility = map.getLayoutProperty(fillLayerId, 'visibility');
            const newVisibility = visibility === 'visible' ? 'none' : 'visible';

            // Toggle visibility for all related layers
            layers.forEach(layerId => {
                if (map.getLayer(layerId)) {
                    map.setLayoutProperty(layerId, 'visibility', newVisibility);
                }
            });

            setPolygonsEnabled(newVisibility === 'visible');
        }
    }, []);

    // Start periodic polygon updates (every 2 minutes)
    const startPolygonUpdates = useCallback(() => {
        // Initial fetch
        fetchPolygons().then(polygons => {
            if (polygons && polygons.length > 0 && mapRef.current) {
                updatePolygonLayers(mapRef.current, polygons);
            }
        });

        // Update every 2 minutes
        polygonUpdateIntervalRef.current = setInterval(async () => {
            const polygons = await fetchPolygons();
            if (polygons && mapRef.current) {
                updatePolygonLayers(mapRef.current, polygons);
            }
        }, 120000); // 2 minutes
    }, [fetchPolygons, updatePolygonLayers]);

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

                // Add cloud layer if API key is available
                if (CLOUDS_TILE_URL) {
                    updateCloudLayer(map);
                    console.log('☁️ Cloud layer initialized (OpenWeatherMap)');
                    console.log('💡 If clouds don\'t appear, API key may need 1-2 hours to activate');
                } else {
                    console.warn('⚠️ No OpenWeather API key configured. Cloud layer disabled.');
                }

                // Start polygon updates
                startPolygonUpdates();

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
            if (polygonUpdateIntervalRef.current) {
                clearInterval(polygonUpdateIntervalRef.current);
                polygonUpdateIntervalRef.current = null;
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
                <h3 onClick={() => setIsMonitoringCollapsed(!isMonitoringCollapsed)} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MdFlashOn />
                        ელვის მონიტორინგი
                    </span>
                    {isMonitoringCollapsed ? <MdExpandMore /> : <MdExpandLess />}
                </h3>
                {!isMonitoringCollapsed && (
                <>
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
                                <>
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
                                    <button
                                        onClick={() => {
                                            setShowContours(!showContours);
                                            // Force radar layer refresh
                                            if (mapRef.current && currentTimeSlot) {
                                                updateRadarLayer(mapRef.current, currentTimeSlot);
                                            }
                                        }}
                                        className="demo-toggle-button"
                                        style={{
                                            background: showContours ? '#FF9800' : '#666',
                                            marginBottom: '10px',
                                            fontSize: '12px'
                                        }}
                                    >
                                        {showContours ? '✓ კონტურები' : '○ კონტურები'}
                                    </button>
                                </>
                            )}

                            {currentTimeSlot && (
                                <div style={{fontSize: '11px', opacity: 0.7}}>
                                    ბოლო განახლება: {new Date(currentTimeSlot * 1000).toLocaleTimeString('ka-GE')}
                                </div>
                            )}
                        </div>

                        {/* Map Style Toggle */}
                        <div style={{marginTop: '15px'}}>
                            <h4 style={{fontSize: '14px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                                🗺️ რუკის ტიპი
                            </h4>
                            <div style={{display: 'flex', gap: '5px'}}>
                                <button
                                    onClick={() => setMapStyle('satellite')}
                                    className="demo-toggle-button"
                                    style={{
                                        background: mapStyle === 'satellite' ? '#4CAF50' : '#666',
                                        flex: 1,
                                        padding: '8px 12px'
                                    }}
                                >
                                    🛰️ სატელიტი
                                </button>
                                <button
                                    onClick={() => setMapStyle('streets')}
                                    className="demo-toggle-button"
                                    style={{
                                        background: mapStyle === 'streets' ? '#4CAF50' : '#666',
                                        flex: 1,
                                        padding: '8px 12px'
                                    }}
                                >
                                    🗺️ ქუჩები
                                </button>
                            </div>
                        </div>

                        {/* Labels Toggle */}
                        <div style={{marginTop: '15px'}}>
                            <h4 style={{fontSize: '14px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                                📍 ლეიბლები
                            </h4>
                            <button
                                onClick={() => setShowLabels(!showLabels)}
                                className="demo-toggle-button"
                                style={{
                                    background: showLabels ? '#4CAF50' : '#666'
                                }}
                            >
                                {showLabels ? '✓ ქალაქები ჩართულია' : '✗ ქალაქები გამორთულია'}
                            </button>
                        </div>

                        {/* Polygon Toggle */}
                        <div style={{marginTop: '15px'}}>
                            <h4 style={{fontSize: '14px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                                ⚠️ ელვის პოლიგონები
                            </h4>
                            <button
                                onClick={togglePolygons}
                                className="demo-toggle-button"
                                style={{
                                    background: polygonsEnabled ? '#4CAF50' : '#666'
                                }}
                            >
                                {polygonsEnabled ? '✓ პოლიგონები ჩართულია' : '✗ პოლიგონები გამორთულია'}
                            </button>
                            {polygonsData.length > 0 && (
                                <div style={{fontSize: '11px', opacity: 0.7, marginTop: '5px'}}>
                                    აქტიური: {polygonsData.length} პოლიგონი
                                </div>
                            )}
                        </div>

                        {/* Cloud Layer Controls */}
                        {CLOUDS_TILE_URL && (
                            <div style={{marginTop: '15px'}}>
                                <h4 style={{fontSize: '14px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                                    ☁️ ღრუბლები (Clouds)
                                </h4>

                                <button
                                    onClick={toggleClouds}
                                    className="demo-toggle-button"
                                    style={{
                                        background: cloudsEnabled ? '#4CAF50' : '#666',
                                        marginBottom: '10px'
                                    }}
                                >
                                    {cloudsEnabled ? '✓ ღრუბლები ჩართულია' : '✗ ღრუბლები გამორთულია'}
                                </button>

                                {cloudsEnabled && (
                                    <div className="opacity-control" style={{marginBottom: '10px'}}>
                                        <label style={{fontSize: '12px', display: 'block', marginBottom: '5px'}}>
                                            გამჭვირვალობა: {Math.round(cloudsOpacity * 100)}%
                                        </label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.1"
                                            value={cloudsOpacity}
                                            onChange={(e) => updateCloudOpacity(parseFloat(e.target.value))}
                                            style={{width: '100%'}}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
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
                </>
                )}
            </div>

            {/* Legend */}
            <div className="sferic-legend">
                <div className="legend-title" onClick={() => setIsLegendCollapsed(!isLegendCollapsed)} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>ელვის დარტყმები</span>
                    {isLegendCollapsed ? <MdExpandMore /> : <MdExpandLess />}
                </div>
                {!isLegendCollapsed && (
                <>
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

                {/* Cloud Legend */}
                {CLOUDS_TILE_URL && cloudsEnabled && (
                    <>
                        <div style={{marginTop: '15px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.3)'}}>
                            <div className="legend-title">ღრუბლები</div>
                        </div>
                        <div style={{fontSize: '11px', marginTop: '8px'}}>
                            <div style={{display: 'flex', alignItems: 'center', marginBottom: '4px'}}>
                                <div style={{width: '20px', height: '12px', background: 'rgba(255, 255, 255, 0.9)', marginRight: '8px', border: '1px solid rgba(255,255,255,0.5)'}}></div>
                                <span>ღრუბლიანობა</span>
                            </div>
                            <div style={{fontSize: '10px', opacity: 0.8, marginTop: '5px'}}>
                                წყარო: OpenWeatherMap
                            </div>
                            <div style={{fontSize: '9px', opacity: 0.6, marginTop: '3px', fontStyle: 'italic'}}>
                                API key აქტივაციას 1-2 სთ სჭირდება
                            </div>
                        </div>
                    </>
                )}

                {/* Polygon Legend */}
                {polygonsEnabled && polygonsData.length > 0 && (
                    <>
                        <div style={{marginTop: '15px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.3)'}}>
                            <div className="legend-title">ელვის ზონები</div>
                        </div>
                        <div style={{fontSize: '11px', marginTop: '8px'}}>
                            <div style={{display: 'flex', alignItems: 'center', marginBottom: '4px'}}>
                                <div style={{width: '20px', height: '12px', background: '#81C784', marginRight: '8px', border: '2px solid #42A5F5'}}></div>
                                <span>დაბალი (Low)</span>
                            </div>
                            <div style={{display: 'flex', alignItems: 'center', marginBottom: '4px'}}>
                                <div style={{width: '20px', height: '12px', background: '#4CAF50', marginRight: '8px', border: '2px solid #2196F3'}}></div>
                                <span>საშუალო (Medium)</span>
                            </div>
                            <div style={{display: 'flex', alignItems: 'center', marginBottom: '4px'}}>
                                <div style={{width: '20px', height: '12px', background: '#66BB6A', marginRight: '8px', border: '2px solid #1976D2'}}></div>
                                <span>მაღალი (High)</span>
                            </div>
                            <div style={{marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.2)'}}>
                                <div style={{fontWeight: 'bold', marginBottom: '8px', fontSize: '11px'}}>შტორმის სექტორი (Storm Cell):</div>
                                <div style={{display: 'flex', alignItems: 'center', marginBottom: '4px'}}>
                                    <div style={{width: '20px', height: '12px', background: '#FFEB3B', marginRight: '8px', border: '2px solid #FFEB3B', opacity: 0.7}}></div>
                                    <span>Unknown (უცნობი)</span>
                                </div>
                                <div style={{display: 'flex', alignItems: 'center', marginBottom: '4px'}}>
                                    <div style={{width: '20px', height: '12px', background: '#FF9800', marginRight: '8px', border: '2px solid #FF9800', opacity: 0.7}}></div>
                                    <span>Moderate (ზომიერი)</span>
                                </div>
                                <div style={{display: 'flex', alignItems: 'center', marginBottom: '4px'}}>
                                    <div style={{width: '20px', height: '12px', background: '#9C27B0', marginRight: '8px', border: '2px solid #9C27B0', opacity: 0.7}}></div>
                                    <span>Severe (მძიმე)</span>
                                </div>
                                <div style={{fontSize: '10px', opacity: 0.7, marginTop: '6px'}}>
                                    ელვის აქტივობის ძირითადი ზონა
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Storm Movement Legend */}
                {polygonsEnabled && polygonsData.some(p => p.direction && p.speed) && (
                    <>
                        <div style={{marginTop: '15px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.3)'}}>
                            <div className="legend-title">შტორმის მოძრაობა</div>
                        </div>
                        <div style={{fontSize: '11px', marginTop: '8px'}}>
                            <div style={{fontWeight: 'bold', marginBottom: '6px', fontSize: '11px'}}>Alert Area:</div>
                            <div style={{display: 'flex', alignItems: 'center', marginBottom: '4px'}}>
                                <div style={{width: '20px', height: '4px', background: '#00CED1', marginRight: '8px'}}></div>
                                <span>მიმართულება (Cyan)</span>
                            </div>
                            <div style={{display: 'flex', alignItems: 'center', marginBottom: '8px'}}>
                                <div style={{width: '12px', height: '12px', background: '#00CED1', marginRight: '8px', borderRadius: '50%', border: '2px solid #FFF'}}></div>
                                <span>ცენტრი</span>
                            </div>
                            <div style={{fontWeight: 'bold', marginBottom: '6px', fontSize: '11px', marginTop: '8px'}}>Storm Cell:</div>
                            <div style={{display: 'flex', alignItems: 'center', marginBottom: '4px'}}>
                                <div style={{width: '20px', height: '4px', background: '#FF1493', marginRight: '8px'}}></div>
                                <span>მიმართულება (Pink)</span>
                            </div>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <div style={{width: '12px', height: '12px', background: '#FF1493', marginRight: '8px', borderRadius: '50%', border: '2px solid #FFF'}}></div>
                                <span>ცენტრი</span>
                            </div>
                        </div>
                    </>
                )}
                </>
                )}
            </div>
        </div>
    );
};

export default SfericMap;
