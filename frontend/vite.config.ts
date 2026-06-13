import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

function preconnectApiPlugin(): Plugin {
  return {
    name: 'preconnect-api',
    transformIndexHtml(html) {
      const api = process.env.VITE_API_URL?.trim().replace(/\/$/, '')
      if (!api) return html
      const tag = `<link rel="preconnect" href="${api}" crossorigin />`
      return html.replace('</head>', `    ${tag}\n  </head>`)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), preconnectApiPlugin()],
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, 'src/app'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@widgets': path.resolve(__dirname, 'src/widgets'),
      '@features': path.resolve(__dirname, 'src/features'),
      '@entities': path.resolve(__dirname, 'src/entities'),
      '@shared': path.resolve(__dirname, 'src/shared'),
    },
  },
})
