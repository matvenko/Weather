import React from "react";
import { MdFlashOn, MdMyLocation, MdRefresh, MdPlayArrow, MdStop, MdExpandMore, MdExpandLess } from "react-icons/md";

const SfericControls = ({
    stats,
    userLocation,
    RADIUS_KM,
    isConnected,
    isDemoMode,
    wsError,
    handleRetryConnection,
    handleToggleDemo,
    SUBSCRIPTION_KEY,
    radarEnabled,
    toggleRadar,
    radarOpacity,
    updateRadarOpacity,
    showContours,
    setShowContours,
    currentTimeSlot,
    mapRef,
    updateRadarLayer,
    mapStyle,
    setMapStyle,
    showLabels,
    setShowLabels,
    polygonsEnabled,
    togglePolygons,
    polygonsData,
    cloudsEnabled,
    toggleClouds,
    CLOUDS_TILE_URL,
    cloudsOpacity,
    updateCloudOpacity,
    locationError
}) => {
    return (
        <div style={{ padding: '20px', color: '#fff' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#fff', marginBottom: '15px' }}>
                <MdFlashOn style={{ color: '#fff' }} />
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
                            <div style={{ margin: '15px 0', borderTop: '1px solid rgba(255,255,255,0.2)' }} />

                            <div className="radar-controls">
                                <h4 style={{ fontSize: '14px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px', color: '#fff' }}>
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
                                        <div className="opacity-control" style={{ marginBottom: '10px' }}>
                                            <label style={{ fontSize: '12px', display: 'block', marginBottom: '5px', color: '#fff' }}>
                                                გამჭვირვალობა: {Math.round(radarOpacity * 100)}%
                                            </label>
                                            <input
                                                type="range"
                                                min="0"
                                                max="1"
                                                step="0.1"
                                                value={radarOpacity}
                                                onChange={(e) => updateRadarOpacity(parseFloat(e.target.value))}
                                                style={{ width: '100%' }}
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
                                    <div style={{ fontSize: '11px', opacity: 0.7 }}>
                                        ბოლო განახლება: {new Date(currentTimeSlot * 1000).toLocaleTimeString('ka-GE')}
                                    </div>
                                )}
                            </div>

                            {/* Map Style Toggle */}
                            <div style={{ marginTop: '15px' }}>
                                <h4 style={{ fontSize: '14px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px', color: '#fff' }}>
                                    🗺️ რუკის ტიპი
                                </h4>
                                <div style={{ display: 'flex', gap: '5px' }}>
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
                            <div style={{ marginTop: '15px' }}>
                                <h4 style={{ fontSize: '14px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px', color: '#fff' }}>
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
                            <div style={{ marginTop: '15px' }}>
                                <h4 style={{ fontSize: '14px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px', color: '#fff' }}>
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
                                    <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '5px', color: '#fff' }}>
                                        აქტიური: {polygonsData.length} პოლიგონი
                                    </div>
                                )}
                            </div>

                            {/* Cloud Layer Controls */}
                            {CLOUDS_TILE_URL && (
                                <div style={{ marginTop: '15px' }}>
                                    <h4 style={{ fontSize: '14px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px', color: '#fff' }}>
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
                                        <div className="opacity-control" style={{ marginBottom: '10px' }}>
                                            <label style={{ fontSize: '12px', display: 'block', marginBottom: '5px', color: '#fff' }}>
                                                გამჭვირვალობა: {Math.round(cloudsOpacity * 100)}%
                                            </label>
                                            <input
                                                type="range"
                                                min="0"
                                                max="1"
                                                step="0.1"
                                                value={cloudsOpacity}
                                                onChange={(e) => updateCloudOpacity(parseFloat(e.target.value))}
                                                style={{ width: '100%' }}
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
        </div>
    );
};

export default SfericControls;
