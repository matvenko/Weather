# Sferic Map - Lightning Monitoring System

## Session Context (for future reference)

### Current Status (December 2025)
- **Implementation**: Complete and fully functional
- **Lightning WebSocket**: Real-time strike data via Earth Networks Pulse API
- **Radar Overlay**: PulseRad precipitation radar with REST API integration
- **Map Providers**: Multiple tile sources (Esri, OpenStreetMap)
- **Subscription**: Enterprise Pulse API Basic (active until 01/16/2026)

### What Works
- ✅ Real-time lightning strike visualization with WebSocket
- ✅ PulseRad radar overlay with precipitation intensity
- ✅ Lightning warning polygons from backend API
- ✅ Multiple map styles (satellite imagery and street maps)
- ✅ City labels and transportation overlays
- ✅ User geolocation with 10km radius visualization
- ✅ Interactive controls for radar opacity and effects
- ✅ Demo mode for testing when WebSocket unavailable
- ✅ Statistics panel with strike counts and alerts
- ✅ Automatic radar updates every 5 minutes
- ✅ Automatic polygon updates every 2 minutes

### What Needs Attention
- **Production Key Management**: Store API keys securely in `.env`
- **Subscription Expiry**: Current subscription ends 01/16/2026
- **Storm Polygons**: Not available in Basic API (requires Enterprise tier)
- **Rate Limiting**: Monitor API usage to stay within limits

### Key Files to Edit
```
src/pages/SfericMap/SfericMap.jsx  - Main component (all logic)
src/pages/SfericMap/sfericMap.css  - All styles
src/App.jsx                         - Route definition (line ~45)
src/components/header/HeaderContainer.jsx - Navigation menu item
```

### Environment Variables
```env
# Lightning WebSocket API (Pulse API)
VITE_SFERIC_API_KEY=8E2A3C14-B44A-41AC-A0B8-74AA1123A912

# REST API Subscription Key (for radar tiles)
VITE_EARTH_NETWORKS_SUBSCRIPTION_KEY=your-subscription-key-here
```

### Quick Test
1. Run `npm run dev`
2. Go to `/sferic-map`
3. Allow location permission when prompted
4. Test radar overlay visibility
5. Try switching between satellite and street map views
6. Toggle city labels on/off
7. Click "დემო ჩართვა" to see simulated lightning (if WebSocket fails)

---

## Overview

Sferic Map is a real-time lightning monitoring page integrated with Earth Networks Sferic API. The page displays an interactive map with live lightning strike data, user geolocation with customizable radius, and comprehensive statistics.

## Features

### 1. Interactive Map
- **Map Engine**: Mapbox GL JS v1.11.1 (loaded from meteoblue CDN)
- **Base Map Options**:
  - **Satellite**: Esri World Imagery (default)
  - **Streets**: OpenStreetMap tiles
- **Overlay Layers**:
  - City labels (Esri World Boundaries and Places)
  - Transportation (Esri World Transportation - roads, highways)
  - PulseRad radar (Earth Networks precipitation data)
  - Lightning strikes (real-time via WebSocket)
- **Default Center**: Tbilisi, Georgia (44.793, 41.715)
- **Default Zoom**: 6 (country level)
- **All tile services are free** - no API keys required for map tiles

### 2. User Geolocation
- Automatically requests browser geolocation permission on page load
- Displays user location with a styled marker (blue dot with white border)
- Shows 10km radius circle around user location
- Counts lightning strikes within user's radius
- Falls back to Georgia bounds if geolocation is denied

### 3. Lightning Strike Visualization
- Real-time lightning markers with pulse animation
- Yellow glowing markers for new strikes
- Markers automatically fade out after 10 seconds
- Tracks strikes within user's radius separately

### 4. WebSocket Connection
- Connects to Earth Networks lightning WebSocket API
- Auto-reconnects up to 5 times on connection failure
- Falls back to Demo Mode when connection fails

### 5. Demo Mode
- Activates when WebSocket connection fails
- Simulates realistic lightning strikes around Georgia
- Generates strikes every 2-5 seconds
- Occasionally generates multiple strikes in quick succession (storm simulation)
- Orange status indicator shows demo mode is active

### 6. PulseRad Weather Radar
- **Real-time precipitation data** from Earth Networks PulseRad API
- **Color-coded intensity**: Blue (light) → Green → Yellow → Orange → Red (extreme)
- **Automatic updates**: Refreshes every 5 minutes (300 seconds)
- **Interactive controls**:
  - Toggle radar visibility on/off
  - Adjust opacity (0-100%)
  - Apply contour enhancement effect
- **Latest time slot display**: Shows timestamp of current radar data
- **Tile-based rendering**: Seamless integration with map tiles

### 7. Map Style Controls
- **Base Map Selector**: Switch between satellite imagery and street maps
- **Labels Toggle**: Show/hide city names and boundaries
- **Transportation Layer**: Optional road and highway overlays
- **Real-time switching**: No page reload required

### 8. Lightning Warning Polygons
- **Backend API Integration**: Fetches lightning warning polygons from `/api/v1/weather/get-polygons`
- **Color-coded severity levels**:
  - Yellow - Low intensity warnings
  - Orange - Medium intensity warnings
  - Red - High intensity/severe warnings
- **Interactive polygons**: Click to view detailed alert information
- **Automatic updates**: Refreshes every 2 minutes
- **Toggle control**: Show/hide polygons independently from other layers
- **Popup details**: Shows headline, severity, lightning level, description, and expiry time

### 9. Statistics Panel
- **10 km radius indicator**: Shows user's monitoring zone with color-coded alerts
- **Strikes in radius**: Lightning strikes within 10km of user
- **Total strikes**: All strikes since page load
- **Last minute**: Strikes in the last 60 seconds
- **Last strike time**: Timestamp of most recent strike
- **Connection status**: Shows connected/demo/error state
- **Alert levels**:
  - Blue (normal) - No recent strikes
  - Yellow (warning) - 1 strike in last 5 minutes
  - Red (danger) - 2+ strikes in last 5 minutes

## Technical Implementation

### File Structure
```
src/pages/SfericMap/
├── SfericMap.jsx    # Main component
└── sfericMap.css    # Styles
```

### Dependencies
- React (useEffect, useRef, useState, useCallback)
- react-icons (MdFlashOn, MdMyLocation, MdRefresh)
- Mapbox GL JS (loaded dynamically)

### Environment Variables
```env
# Lightning WebSocket API
VITE_SFERIC_API_KEY=your-earth-networks-ws-api-key

# PulseRad REST API
VITE_EARTH_NETWORKS_SUBSCRIPTION_KEY=your-subscription-key
```

**Note**:
- WebSocket API key is used for real-time lightning strikes
- Subscription key is required for PulseRad radar overlay
- If subscription key is not provided, radar features will be disabled

### Key Functions

#### `createCircleGeoJSON(center, radiusKm, points)`
Creates a GeoJSON polygon representing a circle around a center point.
- Uses geodesic calculations for accurate radius at any latitude
- Default 64 points for smooth circle rendering

#### `calculateDistance(lat1, lon1, lat2, lon2)`
Haversine formula implementation for calculating distance between two coordinates in kilometers.

#### `addLightningMarker(lng, lat, data)`
Adds an animated lightning marker to the map:
- Creates DOM element with CSS animation
- Checks if strike is within user's radius
- Updates statistics
- Auto-removes after 10 seconds

#### `connectWebSocket()`
Manages WebSocket connection to Earth Networks:
- Handles connection, messages, errors, and close events
- Implements reconnection logic with exponential backoff
- Triggers demo mode after max retries

#### `startDemoMode()` / `stopDemoMode()`
Controls simulated lightning data:
- Generates random strikes within Georgia bounds
- Randomized intervals for realistic effect

### CSS Classes

| Class | Description |
|-------|-------------|
| `.sferic-map-wrap` | Main container, full viewport |
| `.sferic-map-container` | Map canvas container |
| `.lightning-marker` | Animated lightning strike dot |
| `.user-location-marker` | User's position indicator |
| `.sferic-controls` | Statistics panel (top-right) |
| `.sferic-legend` | Map legend (bottom-left) |
| `.sferic-loading` | Loading overlay with spinner |
| `.status-dot` | Connection status indicator |
| `.status-dot.connected` | Green - WebSocket connected |
| `.status-dot.demo` | Orange - Demo mode active |
| `.retry-button` | Reconnection button |
| `.demo-notice` | Demo mode warning message |

### Animations

#### Lightning Pulse
```css
@keyframes lightning-pulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(2); opacity: 0.6; }
    100% { transform: scale(3); opacity: 0; }
}
```

## API Integration

### Backend Lightning Polygon API
```
GET /api/v1/weather/get-polygons
```

**Response Format:**
```json
[
  {
    "identifier": "8E3A4B15-C55B-42BD-A1C9-85BB2234B023",
    "severity": "Moderate",
    "headline": "Lightning Alert in Tbilisi Region",
    "description": "Lightning activity detected...",
    "expires": "2025-12-06T15:00:00Z",
    "lightning_level": "Medium",
    "polygon": [
      {"lat": 41.7151, "lng": 44.8271},
      {"lat": 41.7200, "lng": 44.8300}
    ]
  }
]
```

**Coordinate Format Requirements:**
- **Latitude (`lat`)**: Must be between -90° and +90° (South to North)
- **Longitude (`lng`)**: Must be between -180° and +180° (West to East)
- Coordinates should be in WGS84 (EPSG:4326) decimal degrees format

**Auto-Swap Detection (Frontend Fix):**
The frontend automatically detects and corrects swapped coordinates:
- If `lat` is outside valid range (-90 to +90) AND `lng` is within valid lat range
- Coordinates are automatically swapped to correct the issue
- Console warnings are logged when auto-correction occurs
- This handles backend data issues transparently without requiring backend changes

**Polygon Styling (Green with Blue Borders - matching Sferic Maps):**
- `lightning_level: "Low"` or `severity: "Unknown"` → Light Green (#81C784) with Light Blue border (#42A5F5)
- `lightning_level: "Medium"` or `severity: "Moderate"` → Medium Green (#4CAF50) with Blue border (#2196F3)
- `lightning_level: "High"` or `severity: "Severe"` → Bright Green (#66BB6A) with Dark Blue border (#1976D2)

### Earth Networks WebSocket
```
wss://lx.wsapi.earthnetworks.com/ws/?p={API_KEY}&f=json&t=pulse&l=all&k=on
```

**Parameters:**
- `p` - API key/project ID
- `f` - Format (json)
- `t` - Type (pulse for lightning)
- `l` - Location filter (all)
- `k` - Keep-alive (on)

**Expected Message Format:**
```json
{
    "lat": 41.7151,
    "lon": 44.8271,
    "timestamp": "2024-01-15T12:00:00Z",
    "intensity": 15.5
}
```

### PulseRad REST API

**Metadata Endpoint:**
```
https://earthnetworks.azure-api.net/maps/overlays/v2/metadata?lid=pulserad&subscription-key={SUBSCRIPTION_KEY}
```

**Tile Endpoint:**
```
https://earthnetworks.azure-api.net/maps/overlays/tile?x={x}&y={y}&z={z}&t={t}&lid=pulserad&epsg=3857&subscription-key={SUBSCRIPTION_KEY}
```

**Parameters:**
- `lid` - Layer ID (pulserad for precipitation radar)
- `x`, `y`, `z` - Tile coordinates in Mercator projection (EPSG:3857)
- `t` - Time slot (Unix timestamp from metadata)
- `epsg` - Coordinate system (3857 for Web Mercator)
- `subscription-key` - Azure API subscription key

**Metadata Response Format:**
```json
{
    "Code": 200,
    "Result": {
        "PreferredSlot": 1733347200,
        "LatestSlot": 1733347200,
        "Slots": [1733346900, 1733347200, ...]
    }
}
```

**Tile Format:**
- PNG raster tiles (256x256 pixels)
- Color-coded precipitation intensity
- Transparent background for overlay
- Updates available every ~5 minutes

### Map Tile Sources

**Esri World Imagery (Satellite):**
```
https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}
```
- High-resolution satellite imagery
- No API key required (free service)
- Global coverage
- Attribution: © Esri

**OpenStreetMap (Streets):**
```
https://a.tile.openstreetmap.org/{z}/{x}/{y}.png
```
- Community-maintained street maps
- No API key required (free service)
- Includes roads, buildings, landmarks
- Attribution: © OpenStreetMap Contributors

**Esri World Boundaries and Places (Labels):**
```
https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}
```
- City names and boundaries overlay
- Country and administrative borders
- No API key required
- Attribution: © Esri

**Esri World Transportation (Roads):**
```
https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}
```
- Roads, highways, and railways
- Transportation infrastructure
- No API key required
- Attribution: © Esri

## Routes

Added to `src/App.jsx`:
```jsx
<Route path="sferic-map" element={<SfericMapPage />} />
```

Added to header navigation in `src/components/header/HeaderContainer.jsx`:
```jsx
{key: "/sferic-map", label: <NavLink to="/sferic-map">Sferic Map</NavLink>}
```

## Usage

1. Navigate to `/sferic-map`
2. Allow location permission when prompted
3. View real-time lightning data (or demo simulation)
4. Monitor statistics in the control panel
5. Use refresh button to retry WebSocket connection

## Future Improvements

- [ ] Add historical lightning data playback
- [ ] Implement lightning alert notifications
- [ ] Add storm tracking visualization
- [ ] Support for different radius settings
- [ ] Weather layer overlays (radar, precipitation)
- [ ] Lightning intensity color coding
- [ ] Sound alerts for nearby strikes

## Troubleshooting

### Map not loading
- Check browser console for errors
- Verify Esri tile service is accessible
- Ensure Mapbox GL JS script loads correctly

### WebSocket connection failing
- Verify API key is valid
- Check network connectivity
- Demo mode will activate automatically after 5 retries

### Geolocation not working
- Ensure HTTPS or localhost
- Check browser location permissions
- Map will fall back to Georgia bounds

---

## Development Notes

### React StrictMode Considerations
The component uses `mapInitializedRef` to prevent double initialization in React StrictMode.
Key refs used to avoid re-render loops:
- `mapInitializedRef` - prevents map double init
- `userLocationRef` - stores location without causing callback recreation
- `demoIntervalRef` - tracks demo interval for cleanup

### Cleanup on Unmount
The useEffect cleanup properly:
- Clears all intervals (cleanup, stats, demo)
- Closes WebSocket connection
- Removes map instance
- Resets initialization flag

### WebSocket Message Format
Earth Networks sends lightning data in this format:
```json
{"lat": 41.7151, "lon": 44.8271, "timestamp": "...", "intensity": 15.5}
```
Or as an array of pulses for batch updates.

### Demo Mode Bounds (Georgia)
```javascript
const bounds = {
    minLat: 41.0,
    maxLat: 43.5,
    minLng: 40.0,
    maxLng: 46.5,
};
```

### Map Style (Esri Satellite)
Using free Esri tiles - no API key needed:
```
https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}
```

### Radius Calculation
Uses Haversine formula for accurate geodesic distance.
Circle visualization uses approximation based on latitude for performance.

---

## Earth Networks API Reference

### Documentation
- Main docs: https://developer.earthnetworks.com/documentation
- WebSocket endpoint: `wss://lx.wsapi.earthnetworks.com/ws/`

### WebSocket Parameters
| Param | Value | Description |
|-------|-------|-------------|
| p | API_KEY | Project/API key |
| f | json | Response format |
| t | pulse | Data type (lightning pulses) |
| l | all | Location filter |
| k | on | Keep-alive enabled |

### Getting Production API Key
Contact Earth Networks for API subscription:
- Website: https://www.earthnetworks.com/
- Sferic Maps: https://sfericmaps.com/

---

## Related Tasks (task.txt reference)

The original task requested:
1. Lightning detection integration (ელვის დეტექცია)
2. Real-time strike visualization
3. Strike count in radius
4. Similar UI to sfericmap.com

All core requirements have been implemented. Additional features from task.txt that could be added:
- Weather data overlay (temperature, humidity, wind)
- Storm tracking
- Radar data
- Alert notifications
