# PulseRad Radar Overlay Implementation Guide

## Overview
This guide shows how to add the PulseRad radar overlay to your existing Sferic Map to achieve the sf1.png visualization.

## Step 1: Environment Configuration

Create or update `.env` file in project root:

```env
# Lightning WebSocket API (already working)
VITE_SFERIC_API_KEY=8E2A3C14-B44A-41AC-A0B8-74AA1123A912

# REST API Subscription Key (for radar tiles)
VITE_EARTH_NETWORKS_SUBSCRIPTION_KEY=your-subscription-key-here
```

## Step 2: Test Your API Access

Run the test script:

```bash
node test-sferic-api.js YOUR_SUBSCRIPTION_KEY
```

This will verify:
- ✅ Your subscription key is valid
- ✅ You have access to PulseRad radar data
- ✅ API endpoints are responding correctly

## Step 3: Modify SfericMap.jsx

### Add Constants (after line 7)

```javascript
const LIGHTNING_API_KEY = import.meta.env.VITE_SFERIC_API_KEY || "8E2A3C14-B44A-41AC-A0B8-74AA1123A912";
const LIGHTNING_WS_URL = `wss://lx.wsapi.earthnetworks.com/ws/?p=${LIGHTNING_API_KEY}&f=json&t=pulse&l=all&k=on`;

// ADD THESE NEW CONSTANTS:
const SUBSCRIPTION_KEY = import.meta.env.VITE_EARTH_NETWORKS_SUBSCRIPTION_KEY;
const RADAR_METADATA_URL = `https://earthnetworks.azure-api.net/maps/overlays/v2/metadata?lid=pulserad&subscription-key=${SUBSCRIPTION_KEY}`;
const RADAR_TILE_URL = `https://earthnetworks.azure-api.net/maps/overlays/tile?x={x}&y={y}&z={z}&t={t}&lid=pulserad&epsg=3857&subscription-key=${SUBSCRIPTION_KEY}`;
```

### Add State for Radar Layer (after line 105, inside component)

```javascript
const SfericMap = () => {
    // Existing state...
    const containerRef = useRef(null);
    const mapRef = useRef(null);
    // ... other refs ...

    // ADD THESE NEW STATES:
    const [radarEnabled, setRadarEnabled] = useState(true);
    const [radarOpacity, setRadarOpacity] = useState(0.7);
    const [currentTimeSlot, setCurrentTimeSlot] = useState(null);
    const radarUpdateIntervalRef = useRef(null);
```

### Add Radar Functions

Add these functions before the `useEffect` hook:

```javascript
/**
 * Fetch latest radar time slot from metadata API
 */
const fetchRadarMetadata = useCallback(async () => {
    if (!SUBSCRIPTION_KEY) {
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

/**
 * Add or update radar tile layer on map
 */
const updateRadarLayer = useCallback((map, timeSlot) => {
    if (!map || !timeSlot || !SUBSCRIPTION_KEY) return;

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

    // Add radar layer (below lightning markers)
    map.addLayer({
        id: layerId,
        type: 'raster',
        source: sourceId,
        paint: {
            'raster-opacity': radarOpacity,
            'raster-fade-duration': 300
        }
    }, 'lightning-layer-placeholder'); // Add before lightning markers

    console.log('✅ Radar layer added with time slot:', timeSlot);
}, [radarOpacity]);

/**
 * Toggle radar layer visibility
 */
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

/**
 * Update radar opacity
 */
const updateRadarOpacity = useCallback((opacity) => {
    const map = mapRef.current;
    if (!map) return;

    const layerId = 'pulserad-layer';
    if (map.getLayer(layerId)) {
        map.setPaintProperty(layerId, 'raster-opacity', opacity);
        setRadarOpacity(opacity);
    }
}, []);

/**
 * Start periodic radar updates (every 5 minutes)
 */
const startRadarUpdates = useCallback(() => {
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
```

### Update Map Initialization

In your existing `useEffect` hook where the map is initialized, add this after map is created:

```javascript
useEffect(() => {
    // ... existing map initialization code ...

    map.on("load", () => {
        setMapLoaded(true);

        // ADD THIS: Start radar updates when map is loaded
        if (SUBSCRIPTION_KEY) {
            startRadarUpdates();
        } else {
            console.warn('⚠️ No subscription key found. Radar overlay disabled.');
        }

        // ... rest of your existing code ...
    });

    // ... existing cleanup code ...

    return () => {
        // ADD THIS to cleanup:
        if (radarUpdateIntervalRef.current) {
            clearInterval(radarUpdateIntervalRef.current);
        }
        // ... rest of cleanup ...
    };
}, []);
```

### Add Radar Controls UI

Add these controls to your statistics panel (after the existing stats):

```jsx
<div className="sferic-controls">
    <h3>
        <MdFlashOn /> სტატისტიკა
    </h3>

    {/* Existing stats... */}

    {/* ADD THESE NEW CONTROLS: */}
    {SUBSCRIPTION_KEY && (
        <>
            <hr style={{margin: '15px 0', borderColor: 'rgba(255,255,255,0.2)'}} />

            <div className="radar-controls">
                <h4 style={{fontSize: '14px', marginBottom: '10px'}}>
                    📡 რადარი (PulseRad)
                </h4>

                <button
                    onClick={toggleRadar}
                    className="radar-toggle-btn"
                    style={{
                        width: '100%',
                        padding: '8px',
                        marginBottom: '10px',
                        background: radarEnabled ? '#4CAF50' : '#666',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
>
                    {radarEnabled ? '✓ რადარი ჩართულია' : '✗ რადარი გამორთულია'}
                </button>

                {radarEnabled && (
                    <div className="opacity-control">
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
                    <div style={{fontSize: '11px', marginTop: '8px', opacity: 0.7}}>
                        ბოლო განახლება: {new Date(currentTimeSlot * 1000).toLocaleTimeString('ka-GE')}
                    </div>
                )}
            </div>
        </>
    )}
</div>
```

### Update Legend

Add radar color scale to your legend (in the `.sferic-legend` section):

```jsx
<div className="sferic-legend">
    <h4>ლეგენდა</h4>

    {/* Existing lightning legend... */}

    {/* ADD RADAR LEGEND: */}
    {SUBSCRIPTION_KEY && radarEnabled && (
        <>
            <div style={{marginTop: '15px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.3)'}}>
                <strong>რადარი (წვიმა)</strong>
            </div>
            <div style={{fontSize: '11px', marginTop: '8px'}}>
                <div style={{display: 'flex', alignItems: 'center', marginBottom: '4px'}}>
                    <div style={{width: '20px', height: '12px', background: '#4444FF', marginRight: '8px'}}></div>
                    <span>სუსტი</span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', marginBottom: '4px'}}>
                    <div style={{width: '20px', height: '12px', background: '#00FF00', marginRight: '8px'}}></div>
                    <span>ზომიერი</span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', marginBottom: '4px'}}>
                    <div style={{width: '20px', height: '12px', background: '#FFFF00', marginRight: '8px'}}></div>
                    <span>ძლიერი</span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', marginBottom: '4px'}}>
                    <div style={{width: '20px', height: '12px', background: '#FF0000', marginRight: '8px'}}></div>
                    <span>ძალიან ძლიერი</span>
                </div>
            </div>
        </>
    )}
</div>
```

## Step 4: Optional - Add Animation Support

For animated radar (like in sf1.png), you can extend this to cycle through multiple time slots:

```javascript
const [animationPlaying, setAnimationPlaying] = useState(false);
const [timeSlots, setTimeSlots] = useState([]);
const [currentSlotIndex, setCurrentSlotIndex] = useState(0);

// Fetch all available slots
const fetchRadarMetadata = useCallback(async () => {
    // ... existing code ...

    if (data.Code === 200 && data.Result) {
        const slots = data.Result.AnimationSchedules?.[0]?.Slots || [];
        setTimeSlots(slots);
        setCurrentSlotIndex(0);
        return slots[0];
    }
}, []);

// Animation loop
const playAnimation = useCallback(() => {
    if (timeSlots.length === 0) return;

    const interval = setInterval(() => {
        setCurrentSlotIndex(prev => {
            const next = (prev + 1) % timeSlots.length;
            updateRadarLayer(mapRef.current, timeSlots[next]);
            return next;
        });
    }, 500); // Change frame every 500ms

    return interval;
}, [timeSlots, updateRadarLayer]);
```

## Step 5: Testing

1. Get your subscription key from https://profile.earthnetworks.com/Profile/Details
2. Add it to `.env` file
3. Run the test script: `node test-sferic-api.js YOUR_KEY`
4. Start your dev server: `npm run dev`
5. Navigate to `/sferic-map`
6. You should see the radar overlay with precipitation data!

## Expected Result

After implementation, you should see:
- ✅ Radar precipitation overlay (blue → green → yellow → red gradient)
- ✅ Lightning strikes (yellow dots) on top of radar
- ✅ Toggle button to show/hide radar
- ✅ Opacity slider to adjust radar visibility
- ✅ Auto-updating radar data every 5 minutes
- ✅ Visualization matching sf1.png

## Troubleshooting

**Radar layer not showing:**
- Check console for API errors
- Verify subscription key is correct
- Check network tab for tile requests
- Ensure map is fully loaded before adding layer

**API returns 401:**
- Subscription key is invalid or expired
- Check your subscription status at profile.earthnetworks.com

**Tiles loading slowly:**
- Normal for first load (tiles are generated on-demand)
- Consider adding loading indicator
- Tiles are cached by browser after first load

## API Rate Limits

According to the documentation:
- Metadata API: Can be called as needed (recommended every 5 minutes)
- Tile API: No specific limits mentioned, tiles are cached
- WebSocket: Connection-based, already implemented

## Further Enhancements

1. **Historical playback**: Use AnimationSchedules slots array
2. **Multiple layers**: Combine pulserad + lxflash-consumer tiles
3. **Time scrubber**: Let users select specific time slots
4. **Layer opacity per layer**: Separate controls for radar vs lightning
5. **Mobile optimization**: Adjust controls for smaller screens
