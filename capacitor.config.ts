import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.9522e790ce0c42969a137d95b6b864d9',
  appName: 'radon-monitor',
  webDir: 'dist',
  server: {
    url: 'https://9522e790-ce0c-4296-9a13-7d95b6b864d9.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Camera: {
      permissions: ['camera', 'photos']
    }
  }
};

export default config;