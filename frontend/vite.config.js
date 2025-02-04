import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true,
    hmr: {
      protocol: 'ws',  // Use WebSocket protocol
      host: 'localhost',
      port: 3000,
    },
  },
});
