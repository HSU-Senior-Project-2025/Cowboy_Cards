import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cowboycards',
  appName: 'Cowboy Cards',
  webDir: 'dist',
  server: {
    url: 'http://localhost:8080',
    cleartext: true,
  },
};

export default config;
