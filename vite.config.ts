import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path';
import * as dotenv from 'dotenv';

// Load environment file based on NODE_ENV or VITE_ENV
const env = process.env.VITE_ENV || process.env.NODE_ENV || 'development';
const envFile = `.env.${env}`;
dotenv.config({ path: envFile });
dotenv.config(); // fallback to .env

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {}
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
