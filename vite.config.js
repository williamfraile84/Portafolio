import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'smart-html-transform',
      transformIndexHtml(html, ctx) {
        // En modo desarrollo con servidor Vite (npm run dev), inyectar /src/main.jsx para HMR
        if (ctx.server) {
          return html
            .replace(/<script type="module" crossorigin src="\.\/assets\/[^"]+"><\/script>/g, '<script type="module" src="/src/main.jsx"></script>')
            .replace(/<link rel="stylesheet" crossorigin href="\.\/assets\/[^"]+">/g, '');
        }
        return html;
      }
    }
  ],
  base: './', // Rutas relativas para compatibilidad universal en GitHub Pages
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
})
