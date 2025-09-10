/**
 * Simple test to verify basic React Native Web functionality
 */

console.log('🧪 Starting simple test...');

// Test if we can at least run basic JavaScript
console.log('✅ JavaScript execution working');

// Try to check if React is available
try {
    if (typeof React !== 'undefined') {
        console.log('✅ React is available');
    } else {
        console.log('⚠️ React not found in global scope');
    }
} catch (e) {
    console.log('❌ React check failed:', e.message);
}

// Try to check if React Native is available
try {
    const RN = require('react-native');
    console.log('✅ React Native is available');
    console.log('📱 Platform:', RN.Platform.OS);
} catch (e) {
    console.log('❌ React Native check failed:', e.message);
}

// Try to check if Expo is available
try {
    const Constants = require('expo-constants');
    console.log('✅ Expo Constants available');
    console.log('📋 App name:', Constants.default.appOwnership);
} catch (e) {
    console.log('❌ Expo Constants check failed:', e.message);
}

console.log('🎯 Simple test completed');
