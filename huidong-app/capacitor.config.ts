import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.huidong',
  appName: 'huidong-app',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;