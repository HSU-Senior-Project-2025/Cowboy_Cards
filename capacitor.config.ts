import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cowboycards',
  appName: 'Cowboy Cards',
  webDir: 'public',
  server: {
    url: 'http://10.84.16.34:8080/',// this is the IP from the second line ("Network") of the output of 'npm run dev' that runs the Vite front-end dev server
    cleartext: true,
  }
};

export default config;
