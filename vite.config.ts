import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

/** Make Vite-injected CSS load async so it doesn't block FCP/LCP. */
function nonBlockingCss() {
  return {
    name: 'non-blocking-css',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        return html.replace(
          /<link rel="stylesheet"([^>]*?)href="(\/assets\/[^"]+\.css)"([^>]*)>/g,
          (_, before, href, after) =>
            `<link rel="stylesheet" href="${href}" media="print" onload="this.media='all'">` +
            `<noscript><link rel="stylesheet" href="${href}"></noscript>`
        )
      },
    },
  }
}

export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    nonBlockingCss(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/scheduler/')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'lucide';
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },


  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
