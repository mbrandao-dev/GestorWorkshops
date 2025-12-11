/**
 * API Configuration
 * 
 * Production: Uses Render.com hosted API
 * Development: Uses local server based on platform
 * 
 * To switch between production and development:
 * - Set USE_PRODUCTION = true to use Render.com
 * - Set USE_PRODUCTION = false to use local server
 */

import { Platform } from 'react-native';

// Toggle between production and local development
const USE_PRODUCTION = false;

// Production API URL (Render.com)
const PRODUCTION_API_URL = 'https://xxxxx.onrender.com/api';

// Automatic platform detection for local development
export const getApiBaseUrl = (): string => {
    // Use production API if enabled
    if (USE_PRODUCTION) {
        return PRODUCTION_API_URL;
    }

    // Local development URLs
    if (Platform.OS === 'android') {
        // Android emulator uses 10.0.2.2 to access host machine's localhost
        return 'http://10.0.2.2:3000/api';
    } else if (Platform.OS === 'ios') {
        // iOS simulator can use localhost
        return 'http://localhost:3000/api';
    } else {
        // Web or other platforms
        return 'http://localhost:3000/api';
    }
};

