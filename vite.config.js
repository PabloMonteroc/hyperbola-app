import { defineConfig } from 'vite';
import { viteAntiDdosPlugin } from './src/security/antiDdos.js';

export default defineConfig({
  plugins: [
    viteAntiDdosPlugin({
      windowMs: 10000,         // Ventana de 10 segundos
      maxRequests: 50,         // Máximo 50 peticiones por ventana
      banThreshold: 100,       // > 100 peticiones en 10s = ban automático
      banDurationMs: 60000     // 1 minuto de ban para atacantes
    })
  ],
  server: {
    port: 5173,
    host: true
  }
});
