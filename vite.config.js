import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Permite funcionamento correto no GitHub Pages sob qualquer subcaminho
  server: {
    port: 3000,
    open: false
  }
});
