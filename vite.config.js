import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { createApp } from './server/app.js';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'sakhimaa-report-analysis-api',
      configureServer(server) {
        const apiApp = createApp();
        server.middlewares.use(apiApp);
      },
    },
  ],
});
