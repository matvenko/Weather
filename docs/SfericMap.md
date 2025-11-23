# Sferic Map - Lightning Monitoring System

## Session Context (for future reference)

### Current Status (2024)
- **Implementation**: Complete and functional
- **WebSocket**: Using Earth Networks test API key (may need valid key for production)
- **Demo Mode**: Available for testing when no real lightning data
- **Map Provider**: Esri satellite tiles (free, no API key required)

### What Works
- Map loads with satellite imagery
- User geolocation with 10km radius visualization
- Demo mode with simulated lightning strikes
- Statistics panel showing strike counts
- Toggle button to start/stop demo mode

### What Needs Attention
- **API Key**: Current key `8E2A3C14-B44A-41AC-A0B8-74AA1123A912` is test/demo key
- **Production**: Need valid Earth Networks API subscription for real data
- **WebSocket URL**: `wss://lx.wsapi.earthnetworks.com/ws/` - verify if correct for production

### Key Files to Edit
```
src/pages/SfericMap/SfericMap.jsx  - Main component (all logic)
src/pages/SfericMap/sfericMap.css  - All styles
src/App.jsx                         - Route definition (line ~45)
src/components/header/HeaderContainer.jsx - Navigation menu item
```

### Environment Variable
```env
VITE_SFERIC_API_KEY=your-production-api-key
```

### Quick Test
1. Run `npm run dev`
2. Go to `/sferic-map`
3. Click "დემო ჩართვა" to see simulated lightning

---

## Overview

Sferic Map is a real-time lightning monitoring page integrated with Earth Networks Sferic API. The page displays an interactive map with live lightning strike data, user geolocation with customizable radius, and comprehensive statistics.

## Features

### 1. Interactive Map
- **Map Provider**: Esri World Imagery (satellite tiles)
- **Map Library**: Mapbox GL JS v1.11.1 (loaded from meteoblue CDN)
- **Default Center**: Tbilisi, Georgia (44.793, 41.715)
- **Default Zoom**: 6 (country level)

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

### 6. Statistics Panel
- **10 km radius indicator**: Shows user's monitoring zone
- **Strikes in radius**: Lightning strikes within 10km of user
- **Total strikes**: All strikes since page load
- **Last minute**: Strikes in the last 60 seconds
- **Last strike time**: Timestamp of most recent strike
- **Connection status**: Shows connected/demo/error state

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
VITE_SFERIC_API_KEY=your-earth-networks-api-key
```

If not provided, uses default test key.

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
