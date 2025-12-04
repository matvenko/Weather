/**
 * Test script for Earth Networks Sferic API
 * Run this to verify your subscription key and test radar data access
 *
 * Usage: node test-sferic-api.js YOUR_SUBSCRIPTION_KEY
 */

import https from 'https';

const SUBSCRIPTION_KEY = process.argv[2] || 'YOUR_KEY_HERE';

if (SUBSCRIPTION_KEY === 'YOUR_KEY_HERE') {
    console.error('❌ Please provide your subscription key as an argument');
    console.log('Usage: node test-sferic-api.js YOUR_SUBSCRIPTION_KEY');
    process.exit(1);
}

console.log('🧪 Testing Earth Networks Sferic API...\n');

// Test 1: PulseRad Metadata
console.log('📡 Test 1: Fetching PulseRad metadata...');
const metadataUrl = `https://earthnetworks.azure-api.net/maps/overlays/v2/metadata?lid=pulserad&subscription-key=${SUBSCRIPTION_KEY}`;

https.get(metadataUrl, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        if (res.statusCode === 200) {
            console.log('✅ PulseRad metadata retrieved successfully!\n');

            const result = JSON.parse(data);
            console.log('📊 Response Details:');
            console.log('   Layer ID:', result.Result?.Layer?.Id);
            console.log('   Description:', result.Result?.Layer?.Description);
            console.log('   Latest Slot:', result.Result?.LatestSlot);
            console.log('   Preferred Slot:', result.Result?.PreferredSlot);
            console.log('   Update Interval:', result.Result?.AnimationSchedules?.[0]?.IntervalSeconds, 'seconds');
            console.log('   Available Slots:', result.Result?.AnimationSchedules?.[0]?.Slots?.length);
            console.log('   Bounds:', result.Result?.Layer?.Bounds);
            console.log('\n✅ Your API key is VALID and working!');
            console.log('✅ You have access to PulseRad radar data!');
            console.log('\n📝 Next steps:');
            console.log('   1. Add this key to your .env file as VITE_EARTH_NETWORKS_SUBSCRIPTION_KEY');
            console.log('   2. Implement radar tile layer in SfericMap.jsx');

        } else {
            console.error('❌ API request failed');
            console.error('   Status Code:', res.statusCode);
            console.error('   Response:', data);
        }
    });
}).on('error', (err) => {
    console.error('❌ Network error:', err.message);
});

// Test 2: Lightning Metadata
console.log('\n📡 Test 2: Fetching Lightning metadata...');
const lightningUrl = `https://earthnetworks.azure-api.net/maps/overlays/v2/metadata?lid=lxflash-consumer&subscription-key=${SUBSCRIPTION_KEY}`;

https.get(lightningUrl, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        if (res.statusCode === 200) {
            console.log('✅ Lightning metadata retrieved successfully!\n');

            const result = JSON.parse(data);
            console.log('📊 Lightning Layer Details:');
            console.log('   Layer ID:', result.Result?.Layer?.Id);
            console.log('   Description:', result.Result?.Layer?.Description);
            console.log('   Update Intervals:', result.Result?.AnimationSchedules?.map(s => s.IntervalSeconds + 's').join(', '));
        }
    });
}).on('error', (err) => {
    console.error('❌ Network error:', err.message);
});
